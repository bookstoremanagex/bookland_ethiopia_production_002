import { getCurrentSession } from "@/app/actions/auth-actions";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default async function ProfilePage() {
    const session = await getCurrentSession();

    return (
        <div className="p-4 md:p-8 lg:p-10">
            <div className="max-w-2xl mx-auto space-y-8">
                <div className="bg-white rounded-[2rem] border-2 border-primarycolor/5 shadow-lg overflow-hidden">
                    <div className="p-8 bg-gradient-to-br from-primarycolor to-primarycolor/80 text-white">
                        <div className="size-20 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                            <User className="size-10" />
                        </div>
                        <h1 className="text-2xl font-black text-center uppercase tracking-widest">{session?.name || "User"}</h1>
                        <p className="text-center text-white/70 font-bold text-sm uppercase tracking-widest mt-1">{session?.role}</p>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50">
                            <Mail className="size-5 text-primarycolor" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email</p>
                                <p className="font-bold">{session?.email || "—"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50">
                            <Shield className="size-5 text-primarycolor" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Role</p>
                                <p className="font-bold capitalize">{session?.role || "—"}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50">
                            <Calendar className="size-5 text-primarycolor" />
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Dashboard</p>
                                <p className="font-bold">Finance Officer Full</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}