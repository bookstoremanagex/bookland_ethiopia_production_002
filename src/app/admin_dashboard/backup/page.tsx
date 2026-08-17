import { getLocalBackups } from "@/app/actions/backup-actions";
import BackupClient from "./BackupClient";

export default async function BackupPage() {
    const res = await getLocalBackups();
    const backups = res.success ? res.data : [];

    return (
        <>
            {!res.success && (
                <div className="p-12 border-2 border-destructive/20 bg-destructive/5 rounded-[2.5rem] text-center space-y-4 m-8">
                    <p className="text-destructive font-black text-xl uppercase">Failed to Load Backups</p>
                    <p className="text-muted-foreground font-bold">{(res as any).error}</p>
                </div>
            )}
            <BackupClient initialBackups={backups} />
        </>
    );
}