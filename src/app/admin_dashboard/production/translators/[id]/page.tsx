import React from 'react';
import { getTranslatorById } from '../../../../actions/translator-actions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  Activity,
  ArrowRight
} from 'lucide-react';
import { Button } from '../../../../../components/ui/button';
import { cn } from '../../../../../lib/utils';

interface TranslatorDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function TranslatorDetailsPage({ params }: TranslatorDetailsPageProps) {
  const { id } = await params;
  const response = await getTranslatorById(Number(id));

  if (!response.success || !response.data) {
    notFound();
  }

  const translator = response.data;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border-2 border-primarycolor/10 shadow-2xl shadow-primarycolor/5">
          <div className="flex items-center gap-6">
            <div className="size-20 rounded-3xl bg-secondarycolor/10 flex items-center justify-center text-secondarycolor border-2 border-secondarycolor/20">
              <User className="size-10" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Button variant="ghost" asChild className="p-0 h-auto hover:bg-transparent text-primarycolor/50 font-black uppercase tracking-widest text-[10px]">
                  <Link href="/admin_dashboard/production/translators" className="flex items-center gap-1">
                    <ChevronLeft className="size-3" /> All Translators
                  </Link>
                </Button>
                <div className="size-1 rounded-full bg-primarycolor/20" />
                <span className="text-[10px] font-black uppercase tracking-widest text-secondarycolor/60">Expert Resource</span>
              </div>
              <h1 className="text-4xl font-black text-primarycolor uppercase tracking-tighter leading-none">{translator.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <p className="text-muted-foreground font-bold tracking-tight">
                  Certified Production Partner
                </p>
                {translator.pen_name && (
                  <>
                    <div className="size-1 rounded-full bg-primarycolor/20" />
                    <span className="text-xs font-black uppercase tracking-widest text-secondarycolor bg-secondarycolor/5 border border-secondarycolor/10 px-2 py-0.5 rounded-lg italic">
                      Pen Name: {translator.pen_name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="px-6 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-black uppercase tracking-widest border-2 border-emerald-100 shadow-lg shadow-emerald-500/5 flex items-center gap-2">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                Active Talent
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Info */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 border-2 border-primarycolor/10 shadow-xl space-y-8">
              <h3 className="text-lg font-black text-primarycolor uppercase tracking-widest flex items-center gap-3">
                <div className="size-10 rounded-xl bg-primarycolor/10 flex items-center justify-center">
                  <Activity className="size-5" />
                </div>
                Contact Details
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4 group">
                  <div className="size-12 rounded-2xl bg-primarycolor/5 flex items-center justify-center text-primarycolor group-hover:bg-primarycolor group-hover:text-white transition-all">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</p>
                    <p className="font-bold text-secondarycolor">{translator.email || "No email provided"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group">
                  <div className="size-12 rounded-2xl bg-primarycolor/5 flex items-center justify-center text-primarycolor group-hover:bg-primarycolor group-hover:text-white transition-all">
                    <Phone className="size-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Phone Number</p>
                    <p className="font-bold text-secondarycolor">{translator.phoneNumber || "No phone provided"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primarycolor rounded-[2.5rem] p-8 text-white shadow-2xl shadow-primarycolor/20 space-y-6">
              <div className="size-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                <BookOpen className="size-8" />
              </div>
              <div>
                <h4 className="text-2xl font-black uppercase tracking-tight">Assignment Portfolio</h4>
                <p className="text-white/70 font-medium text-sm mt-2">Managing {translator.books.length} active translation projects across our current catalog.</p>
              </div>
              <Button asChild className="w-full h-14 bg-white text-primarycolor hover:bg-secondarycolor hover:text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl">
                <Link href={`/admin_dashboard/production/translation_work/new?translatorId=${translator.id}`}>
                  Assign New Project
                </Link>
              </Button>
            </div>
          </div>

          {/* Project History */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 border-2 border-primarycolor/10 shadow-2xl space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-primarycolor uppercase tracking-tight">Project <span className="text-secondarycolor">History</span></h3>
                <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{translator.books.length} Total Titles</div>
              </div>

              <div className="space-y-6">
                {translator.books.length > 0 ? (
                  translator.books.map((assignment: any) => (
                    <Link 
                      key={assignment.id} 
                      href={`/admin_dashboard/books/${assignment.books.unique_identification_code}`}
                      className="group block p-6 rounded-3xl bg-primarycolor/5 border-2 border-transparent hover:border-primarycolor/20 hover:bg-white transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="size-16 rounded-2xl overflow-hidden shadow-lg border-2 border-white group-hover:scale-105 transition-transform">
                            {assignment.books.book_image_url ? (
                              <img src={assignment.books.book_image_url} alt={assignment.books.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-emerald-600 flex items-center justify-center text-white font-black">
                                {assignment.books.title[0]}
                              </div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-black text-primarycolor text-xl uppercase tracking-tight group-hover:text-secondarycolor transition-colors">{assignment.books.title}</h4>
                            <div className="flex items-center gap-3 mt-1">
                               <div className="flex items-center gap-1.5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                  <Clock className="size-3" /> {new Date(assignment.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                               </div>
                               <div className="size-1 rounded-full bg-primarycolor/20" />
                               <div className={cn(
                                 "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest",
                                 assignment.Status === "COMPLETED" ? "text-emerald-500" : "text-amber-500"
                               )}>
                                  {assignment.Status === "COMPLETED" ? <CheckCircle2 className="size-3" /> : <Activity className="size-3" />}
                                  {assignment.Status.replace('_', ' ')}
                               </div>
                            </div>
                          </div>
                        </div>
                        <div className="size-12 rounded-2xl bg-white border-2 border-primarycolor/10 flex items-center justify-center text-primarycolor opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all">
                          <ArrowRight className="size-6" />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-20 text-center space-y-4">
                    <div className="size-20 rounded-full bg-primarycolor/5 flex items-center justify-center mx-auto text-primarycolor/20">
                      <BookOpen className="size-10" />
                    </div>
                    <p className="text-muted-foreground font-black uppercase tracking-widest text-sm">No project history found for this translator.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
