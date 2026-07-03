import { ProfileClient } from "./ProfileClient";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  return (
    <div className="min-h-full bg-white p-4 md:p-6">
      <div className="w-full max-w-2xl mx-auto">
        <ProfileClient />
      </div>
    </div>
  );
}
