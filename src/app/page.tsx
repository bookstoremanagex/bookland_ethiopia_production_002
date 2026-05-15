import { getFirstPrinterName } from "@/lib/get-first-printer-name";
import LoginPageClient from "./LoginPageClient";

export const dynamic = "force-dynamic";

export default async function Home() {
  const printer = await getFirstPrinterName();

  const databaseUrl = process.env.DATABASE_URL ?? "";

  return (
    <LoginPageClient
      printerName={printer.ok ? printer.name : null}
      printerFetchFailed={!printer.ok}
      databaseUrl={databaseUrl}
    />
  );
}
