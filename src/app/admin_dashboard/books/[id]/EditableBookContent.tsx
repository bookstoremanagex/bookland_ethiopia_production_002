"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  ChevronLeft,
  BookOpen,
  User,
  Globe,
  PenTool,
  Activity,
  Edit2,
  Check,
  X,
  Trash2,
  Info,
  Layers,
  DollarSign,
  Store,
  ShoppingBag,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { Input } from '../../../../components/ui/input';
import { cn } from '../../../../lib/utils';
import { updateBook, uploadBookImageAction } from '../../../actions/book-actions';
import { updateTranslationProjectStatus } from '../../../actions/translation-project-actions';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs";

// Modular Components
import BasicInfo from '../../../../components/admin_dashboard_components/book_details/BasicInfo';
import DesignInfo from '../../../../components/admin_dashboard_components/book_details/DesignInfo';
import TranslationInfo from '../../../../components/admin_dashboard_components/book_details/TranslationInfo';
import EditionsInfo from '../../../../components/admin_dashboard_components/book_details/EditionsInfo';
import StoresList from '../../../../components/admin_dashboard_components/book_details/StoresList';
import ShopDistributionList from '../../../../components/admin_dashboard_components/book_details/ShopDistributionList';
import CostsInfo from '../../../../components/admin_dashboard_components/book_details/CostsInfo';
import DeleteBook from '../../../../components/admin_dashboard_components/book_details/DeleteBook';

interface EditableBookContentProps {
  book: any;
  bookShops: any[];
}

export default function EditableBookContent({ book: initialBook, bookShops }: EditableBookContentProps) {
  const [book, setBook] = useState(initialBook);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const dashboardRoot = pathname.split('/').slice(0, 2).join('/');

  // States for Image Upload
  const [imageType, setImageType] = useState<"upload" | "link">("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        toast.error("File size must be less than 4MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartEdit = (field: string, value: any) => {
    setEditingField(field);
    setEditValue(value);
    if (field === 'book_image_url') {
      setImageType(value ? 'link' : 'upload');
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setEditValue(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSaveEdit = async (field: string) => {
    setIsUpdating(true);
    try {
      const costFields = ['translator_cost','cover_design_cost','text_design_cost','editor_cost','typewriting_cost','store_cost','distribution_cost','advertisement_cost','purchasing_right_cost'];
      const value = costFields.includes(field)
        ? (editValue === '' || editValue === null || editValue === undefined ? null : parseFloat(editValue))
        : editValue;
      const response = await updateBook(book.unique_identification_code, { [field]: value });
      if (response.success) {
        setBook(response.data);
        toast.success(`Updated ${field.replace(/_/g, ' ')} successfully`);
        setEditingField(null);
      } else {
        toast.error(response.error || "Failed to update");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveImage = async () => {
    setIsUpdating(true);
    try {
      let finalImageUrl = editValue || "";

      if (imageType === "upload" && imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadRes = await uploadBookImageAction(formData);
        if (!uploadRes.success) {
          toast.error(uploadRes.error || "Failed to upload image");
          setIsUpdating(false);
          return;
        }
        finalImageUrl = uploadRes.url || "";
      }

      const response = await updateBook(book.unique_identification_code, {
        book_image_url: finalImageUrl || null,
      });

      if (response.success) {
        setBook(response.data);
        toast.success("Updated cover image successfully");
        setEditingField(null);
        setImageFile(null);
        setImagePreview(null);
      } else {
        toast.error(response.error || "Failed to update cover image");
      }
    } catch (error) {
      toast.error("An error occurred while updating cover image");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateTranslationStatus = async (projectId: number, newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await updateTranslationProjectStatus(projectId, newStatus);
      if (response.success) {
        const updatedTranslators = book.translators.map((t: any) =>
          t.id === projectId ? { ...t, Status: newStatus } : t
        );
        setBook({ ...book, translators: updatedTranslators });
        toast.success("Translation status updated");
        setEditingField(null);
      } else {
        toast.error(response.error || "Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      {/* Top Navigation Bar */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-primarycolor/5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-24 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="size-10 md:size-16 rounded-xl md:rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor border-2 border-primarycolor/20 shrink-0">
              <BookOpen className="size-5 md:size-8" />
            </div>
            <div className="min-w-0">
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-secondarycolor/60 truncate block mb-0.5">SKU: {book.book_sku}</span>
              <h1 className="text-lg md:text-3xl font-black text-primarycolor uppercase tracking-tighter leading-tight truncate">{book.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6">
            <Button asChild variant="ghost" className="h-10 md:h-14 px-3 md:px-8 rounded-xl md:rounded-2xl border-2 border-primarycolor/5 hover:bg-primarycolor hover:text-white transition-all font-black uppercase tracking-widest text-[10px] md:text-xs gap-2">
              <Link href={`${dashboardRoot}/books`}>
                <ArrowLeft className="size-4 md:size-5" />
                <span className="hidden sm:inline">Back</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-16 space-y-8 md:space-y-16">
        {/* Status Section */}
        <div className="flex items-center justify-between gap-4 bg-white p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] border-2 border-primarycolor/10 shadow-2xl shadow-primarycolor/5">
          <div>
            <h2 className="text-sm md:text-xl font-black text-primarycolor uppercase tracking-tight">Publication <span className="text-secondarycolor">Status</span></h2>
            <p className="text-muted-foreground font-bold text-[10px] md:text-sm hidden md:block">Current availability and distribution phase.</p>
          </div>
          <div className="flex items-center gap-4">
            {editingField === 'status' ? (
              <div className="flex items-center gap-2 bg-primarycolor/5 p-2 rounded-2xl border-2 border-primarycolor/10">
                <select
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="bg-transparent text-[10px] md:text-xs font-black uppercase tracking-widest px-4 py-1 outline-none"
                >
                  <option value="available">Available</option>
                  <option value="out_of_stock">Out of Stock</option>
                  <option value="discontinued">Discontinued</option>
                </select>
                <Button size="icon" className="size-8 bg-emerald-500 rounded-xl shrink-0" onClick={() => handleSaveEdit('status')}><Check className="size-4" /></Button>
                <Button size="icon" variant="ghost" className="size-8 rounded-xl shrink-0" onClick={handleCancelEdit}><X className="size-4" /></Button>
              </div>
            ) : (
              <div
                className={cn(
                  "px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl text-[9px] md:text-xs font-black uppercase tracking-widest border-2 shadow-lg cursor-pointer hover:scale-105 transition-all flex items-center gap-2 md:gap-3",
                  book.status === "available"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-rose-50 text-rose-600 border-rose-100"
                )}
                onClick={() => handleStartEdit('status', book.status)}
              >
                <div className={cn("size-2 rounded-full", book.status === "available" ? "bg-emerald-500" : "bg-rose-500")} />
                {book.status.replace('_', ' ')}
                <Edit2 className="size-3 opacity-30" />
              </div>
            )}
          </div>
        </div>

        {/* Spacious Tile-Based Tabs Navigation - Wrapping on mobile */}
        <Tabs defaultValue="basic" className="w-full">
          <div className="mb-8 md:mb-16">
            <TabsList className="w-full h-auto p-0 bg-transparent flex flex-wrap gap-2 md:gap-3 justify-center">
              {[
                { value: 'basic', icon: Info, label: 'Info' },
                { value: 'editions', icon: Layers, label: 'Editions' },
                { value: 'costs', icon: DollarSign, label: 'Costs' },
                { value: 'stores', icon: Store, label: 'Stores' },
                { value: 'shop', icon: ShoppingBag, label: 'Shop' },
                { value: 'design', icon: PenTool, label: 'Design' },
                { value: 'translation', icon: Globe, label: 'Translation' },
                { value: 'delete', icon: Trash2, label: 'Delete', danger: true },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "min-w-0 sm:min-w-[120px] md:min-w-[180px] rounded-xl md:rounded-[2rem] px-3 md:px-8 py-2.5 md:py-5 font-black uppercase tracking-[0.15em] text-[10px] md:text-[11px] bg-white border-2 transition-all gap-2 md:gap-3 hover:bg-primarycolor/5 group shadow-sm",
                    tab.danger
                      ? "border-rose-100 text-rose-500 data-[state=active]:bg-rose-600 data-[state=active]:text-white data-[state=active]:border-rose-600 data-[state=active]:shadow-2xl hover:bg-rose-50"
                      : "border-primarycolor/5 text-primarycolor/60 data-[state=active]:bg-primarycolor data-[state=active]:text-white data-[state=active]:border-primarycolor data-[state=active]:shadow-2xl"
                  )}
                >
                  <tab.icon className="size-3.5 md:size-5 opacity-40 group-data-[state=active]:opacity-100 shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="animate-in fade-in zoom-in-95 duration-500">
            <TabsContent value="basic" className="focus-visible:outline-none">
              <BasicInfo
                book={book}
                editingField={editingField}
                editValue={editValue}
                isUpdating={isUpdating}
                onStartEdit={handleStartEdit}
                onCancelEdit={handleCancelEdit}
                onSaveEdit={handleSaveEdit}
                onValueChange={setEditValue}
              />
            </TabsContent>

            <TabsContent value="editions" className="focus-visible:outline-none">
              <EditionsInfo book={book} />
            </TabsContent>

            <TabsContent value="stores" className="focus-visible:outline-none">
              <StoresList book={book} />
            </TabsContent>

            <TabsContent value="shop" className="focus-visible:outline-none">
              <ShopDistributionList book={book} bookShops={bookShops} />
            </TabsContent>

            <TabsContent value="costs" className="focus-visible:outline-none">
              <CostsInfo
                book={book}
                editingField={editingField}
                editValue={editValue}
                isUpdating={isUpdating}
                onStartEdit={handleStartEdit}
                onCancelEdit={handleCancelEdit}
                onSaveEdit={handleSaveEdit}
                onValueChange={setEditValue}
              />
            </TabsContent>

            <TabsContent value="design" className="focus-visible:outline-none">
              <DesignInfo
                book={book}
                editingField={editingField}
                editValue={editValue}
                isUpdating={isUpdating}
                onStartEdit={handleStartEdit}
                onCancelEdit={handleCancelEdit}
                onSaveEdit={handleSaveEdit}
                onValueChange={setEditValue}
              />
            </TabsContent>

            <TabsContent value="translation" className="focus-visible:outline-none">
              <TranslationInfo
                book={book}
                editingField={editingField}
                editValue={editValue}
                isUpdating={isUpdating}
                onStartEdit={handleStartEdit}
                onCancelEdit={handleCancelEdit}
                onUpdateStatus={handleUpdateTranslationStatus}
                onValueChange={setEditValue}
              />
            </TabsContent>

            <TabsContent value="delete" className="focus-visible:outline-none">
              <DeleteBook
                bookId={book.unique_identification_code}
                bookTitle={book.title}
              />
            </TabsContent>
          </div>
        </Tabs>

        {/* Global Image Edit Overlay */}
        {editingField === 'book_image_url' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl space-y-8 animate-in zoom-in-95 duration-300">
              <div className="flex items-center gap-6">
                <div className="size-16 rounded-2xl bg-primarycolor/10 flex items-center justify-center text-primarycolor">
                  <BookOpen className="size-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-primarycolor uppercase tracking-tight">Update <span className="text-secondarycolor">Cover</span></h3>
                  <p className="text-muted-foreground font-bold">Upload a cover image or provide a link.</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setImageType("upload")}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest border-2 transition-all cursor-pointer",
                      imageType === "upload"
                        ? "bg-primarycolor text-white border-primarycolor"
                        : "bg-white text-primarycolor/70 border-primarycolor/10 hover:border-primarycolor/20"
                    )}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageType("link")}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest border-2 transition-all cursor-pointer",
                      imageType === "link"
                        ? "bg-primarycolor text-white border-primarycolor"
                        : "bg-white text-primarycolor/70 border-primarycolor/10 hover:border-primarycolor/20"
                    )}
                  >
                    Provide Link
                  </button>
                </div>

                {imageType === "upload" ? (
                  <div className="space-y-4">
                    <div className={cn(
                      "border-2 border-dashed border-primarycolor/20 rounded-xl p-8 text-center bg-white cursor-pointer hover:border-primarycolor/40 transition-colors relative flex flex-col items-center justify-center min-h-[160px]",
                      imageFile && "border-solid border-primarycolor/30"
                    )}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      {imagePreview ? (
                        <div className="flex flex-col items-center gap-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-24 h-36 object-cover rounded-lg shadow-md border-2 border-primarycolor/10"
                          />
                          <span className="text-xs font-bold text-secondarycolor/80 bg-primarycolor/5 px-3 py-1 rounded-full">
                            {imageFile?.name} ({(imageFile!.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="text-primarycolor font-black text-2xl uppercase tracking-widest">+</div>
                          <div className="text-sm font-bold text-secondarycolor">Click to upload cover image</div>
                          <div className="text-xs text-muted-foreground font-semibold">Supports JPG, PNG, WEBP (Max 4MB)</div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 group">
                    <Input
                      value={editValue ?? ''}
                      onChange={(e) => setEditValue(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="h-16 px-6 rounded-2xl border-2 font-bold text-lg"
                    />
                  </div>
                )}

                <div className="flex gap-4">
                  <Button 
                    className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest bg-primarycolor hover:bg-secondarycolor" 
                    onClick={handleSaveImage} 
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </div>
                    ) : "Save Image"}
                  </Button>
                  <Button variant="outline" className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest border-2" onClick={handleCancelEdit} disabled={isUpdating}>Cancel</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
