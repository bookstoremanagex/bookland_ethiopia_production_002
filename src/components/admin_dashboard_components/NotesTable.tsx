"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search, ChevronLeft, ChevronRight, FileText, Trash2, Plus, Calendar, User, X, Check, Eye } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "../../lib/utils";
import { deleteNote, createNote } from "../../app/actions/notes-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useCalendar } from "../../lib/calendar-context";

export type NoteItem = {
  id: number;
  title: string | null;
  note_content: string;
  accountId: number;
  createdAt: Date | string;
  accounts: {
    name: string;
    account_email: string;
    account_type: string;
  };
};

interface NotesTableProps {
  data: NoteItem[];
  currentUserId: number;
}

export function NotesTable({ data: initialData = [], currentUserId }: NotesTableProps) {
  const router = useRouter();
  const { formatDate, formatShort, formatLong, formatDateTime } = useCalendar();
  const [data, setData] = React.useState<NoteItem[]>(initialData || []);
  const safeData = React.useMemo(() => Array.isArray(data) ? data : [], [data]);
  
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true }
  ]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newContent, setNewContent] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isFormExpanded, setIsFormExpanded] = React.useState(true);

  React.useEffect(() => {
    setData(initialData || []);
  }, [initialData]);



  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) {
      toast.error("Note content is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createNote(
        newTitle.trim() || "Untitled Note",
        newContent.trim(),
        currentUserId
      );

      if (res.success && res.data) {
        toast.success("Note created successfully");
        setIsCreateModalOpen(false);
        
        // Append the new note to the list with fallback fields if necessary
        const newNoteItem: NoteItem = {
          id: res.data.id,
          title: res.data.title,
          note_content: res.data.note_content,
          accountId: res.data.accountId,
          createdAt: new Date(res.data.createdAt),
          accounts: res.data.accounts || {
            name: "Teklu Tilahun",
            account_email: "tekilutilahun@gmail.com",
            account_type: "Admin"
          }
        };

        setData((prev) => [newNoteItem, ...prev]);
        setNewTitle("");
        setNewContent("");
        router.refresh();
      } else {
        toast.error(res.error || "Failed to create note");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = React.useMemo<ColumnDef<NoteItem>[]>(() => [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <div className="space-y-1 min-w-[180px] max-w-[280px]">
          <div className="font-black text-primarycolor line-clamp-1 leading-snug">
            {row.getValue("title") || "Untitled Note"}
          </div>
          <div className="text-[10px] font-black text-secondarycolor/50 uppercase tracking-widest flex items-center gap-1">
            <User className="size-3" />
            {row.original.accounts?.name || "Unknown Author"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "note_content",
      header: "Content",
      cell: ({ row }) => (
        <div className="max-w-[450px] text-sm text-secondarycolor/80 leading-relaxed font-semibold line-clamp-2">
          {row.getValue("note_content")}
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return (
          <div className="text-xs font-bold text-secondarycolor/60 tabular-nums flex items-center gap-2">
            <Calendar className="size-3.5 text-primarycolor/50" />
            {formatDateTime(new Date(date))}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push(`/admin_dashboard/notes/${item.id}`)}
              className="size-9 text-primarycolor hover:text-primarycolor/80 hover:bg-primarycolor/5 rounded-full transition-all active:scale-90"
              title="View Details"
            >
              <Eye className="size-4" />
            </Button>
          </div>
        );
      },
    },
  ], [data]);

  const table = useReactTable({
    data: safeData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      {/* Quick Note Creator Section */}
      <div className="bg-card p-5 md:p-8 rounded-[2rem] border-2 border-primarycolor/5 shadow-md hover:shadow-xl hover:border-primarycolor/10 transition-all duration-300 space-y-6 bg-white">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg md:text-xl font-black text-primarycolor uppercase tracking-tight italic">
              Quick <span className="text-secondarycolor not-italic">Note Creator</span>
            </h2>
            <p className="text-xs font-bold text-muted-foreground">
              Add new reminders, memos, or task updates instantly.
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => setIsFormExpanded(!isFormExpanded)}
            className="text-xs font-black uppercase tracking-widest text-primarycolor hover:bg-primarycolor/5 rounded-xl px-4 py-2"
          >
            {isFormExpanded ? "Collapse Editor" : "Expand Editor"}
          </Button>
        </div>

        {isFormExpanded && (
          <form onSubmit={handleCreate} className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-secondarycolor uppercase tracking-widest">
                  Note Title
                </label>
                <Input
                  placeholder="e.g. Weekly Inventory Strategy Memo"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-12 border-primarycolor/10 focus:border-primarycolor focus:ring-primarycolor/5 rounded-2xl font-semibold"
                />
              </div>

              <div className="md:col-span-1">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-primarycolor hover:bg-primarycolor/90 text-white rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-primarycolor/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="size-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                  ) : (
                    <>
                      <Plus className="size-5" />
                      Save Note to Database
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-secondarycolor uppercase tracking-widest">
                Note Content *
              </label>
              <textarea
                placeholder="Type detailed note content here... (supports multi-line and holds plenty of space to write notes)"
                required
                rows={6}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full p-4 border border-primarycolor/10 focus:border-primarycolor focus:ring-2 focus:ring-primarycolor/5 outline-none rounded-2xl font-semibold text-sm resize-y bg-background/50 transition-all min-h-[160px] leading-relaxed text-secondarycolor"
              />
            </div>
          </form>
        )}
      </div>

      {/* Action Bar */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-6 bg-card p-4 md:p-6 rounded-[2rem] border-2 border-primarycolor/5 shadow-md hover:shadow-xl hover:border-primarycolor/10 transition-all duration-300">
        <div className="relative w-full xl:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-primarycolor transition-all duration-500 group-focus-within:scale-110" />
          <Input
            placeholder="Search notes by title, content..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="pl-12 h-12 bg-background/50 border-primarycolor/10 focus:border-primarycolor focus:ring-primarycolor/5 rounded-2xl transition-all duration-300 focus:shadow-inner font-semibold"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block rounded-3xl border-2 border-primarycolor/10 bg-card shadow-2xl overflow-hidden">
        <Table>
          <TableHeader className="bg-primarycolor/5 border-b-2 border-primarycolor/10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id} 
                    className={cn(
                      "h-16 font-black text-secondarycolor py-4 text-[10px] uppercase tracking-[0.2em] px-6 cursor-pointer select-none hover:text-primarycolor transition-colors",
                      header.column.getCanSort() && "relative"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1.5">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted() as string] ?? null}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="group hover:bg-primarycolor/5 transition-all duration-300 border-primarycolor/5 hover:shadow-inner"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-5 px-6 transition-transform duration-300 group-hover:translate-x-1">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-80 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-40">
                    <FileText className="size-16 text-primarycolor animate-pulse" />
                    <p className="text-xl font-black uppercase tracking-widest">No notes found</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-6 md:hidden">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            const item = row.original;
            return (
              <div
                key={row.id}
                className="bg-card rounded-3xl border-2 border-primarycolor/10 p-6 shadow-xl hover:shadow-2xl transition-all duration-500 group"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-primarycolor line-clamp-1 leading-tight">
                      {item.title || "Untitled"}
                    </h3>
                    <div className="text-[10px] font-black text-secondarycolor/50 uppercase tracking-widest flex items-center gap-1">
                      <User className="size-3" />
                      {item.accounts?.name || "Unknown Author"}
                    </div>
                  </div>
                </div>

                <p className="text-sm font-semibold text-secondarycolor/80 leading-relaxed break-words whitespace-pre-wrap line-clamp-4">
                  {item.note_content}
                </p>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[10px] font-bold text-secondarycolor/50 tabular-nums flex items-center gap-1.5">
                    <Calendar className="size-3 text-primarycolor/45" />
                    {formatDateTime(new Date(item.createdAt))}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => router.push(`/admin_dashboard/notes/${item.id}`)}
                    className="text-primarycolor font-bold hover:bg-primarycolor/5 rounded-xl h-9 px-4 transition-all"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-24 text-center space-y-4 opacity-30">
            <FileText className="size-20 mx-auto text-primarycolor" />
            <p className="text-xl font-black uppercase tracking-widest">No notes found</p>
          </div>
        )}
      </div>

      {/* Pagination Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-8 px-4 py-8 border-t-2 border-primarycolor/5">
        <div className="text-sm font-black text-muted-foreground order-2 sm:order-1 uppercase tracking-widest">
          Showing <span className="text-primarycolor underline decoration-2 underline-offset-4">{table.getRowModel().rows.length}</span> /{" "}
          <span className="text-secondarycolor">{safeData.length}</span> Notes
        </div>
        <div className="flex items-center gap-4 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-12 px-6 border-2 border-primarycolor/20 hover:bg-primarycolor/5 rounded-2xl transition-all font-black disabled:opacity-20 active:scale-90"
          >
            <ChevronLeft className="size-5 mr-1" />
            Prev
          </Button>
          <div className="flex items-center gap-3 px-6 h-12 bg-primarycolor/5 rounded-2xl text-xs font-black text-secondarycolor border-2 border-primarycolor/10 shadow-inner">
            PAGE {table.getState().pagination.pageIndex + 1} <span className="opacity-20 mx-1">OF</span> {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-12 px-6 border-2 border-primarycolor/20 hover:bg-primarycolor/5 rounded-2xl transition-all font-black disabled:opacity-20 active:scale-90"
          >
            Next
            <ChevronRight className="size-5 ml-1" />
          </Button>
        </div>
      </div>

      {/* Create Note Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-secondarycolor/30 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-card rounded-[2.5rem] border-2 border-primarycolor/10 shadow-2xl p-5 md:p-8 space-y-6 relative animate-in zoom-in-95 duration-300 bg-white">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-6 right-6 text-muted-foreground hover:text-secondarycolor p-1.5 hover:bg-slate-50 rounded-full transition-all"
            >
              <X className="size-5" />
            </button>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-primarycolor uppercase tracking-tight italic">
                Add <span className="text-secondarycolor not-italic">New Note</span>
              </h2>
              <p className="text-sm font-bold text-muted-foreground">
                Document thoughts, memos, or task updates.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-secondarycolor uppercase tracking-widest">
                  Note Title
                </label>
                <Input
                  placeholder="e.g. Weekly Inventory Audit Memo"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-12 border-primarycolor/10 focus:border-primarycolor focus:ring-primarycolor/5 rounded-2xl font-semibold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-secondarycolor uppercase tracking-widest">
                  Note Content *
                </label>
                <textarea
                  placeholder="Type your notes details here..."
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={5}
                  className="w-full p-4 border border-primarycolor/10 focus:border-primarycolor focus:ring-2 focus:ring-primarycolor/5 outline-none rounded-2xl font-semibold text-sm resize-none bg-background/50 transition-all"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 h-12 border-2 border-primarycolor/10 hover:bg-primarycolor/5 rounded-2xl font-black transition-all active:scale-95"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-primarycolor hover:bg-primarycolor/90 text-white rounded-2xl font-black transition-all active:scale-95 shadow-lg shadow-primarycolor/20 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <div className="size-5 border-2 border-white border-t-transparent animate-spin rounded-full" />
                  ) : (
                    <>
                      <Check className="size-5" />
                      Save Note
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
