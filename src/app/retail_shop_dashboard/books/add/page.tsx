import { getRetailBooks } from "@/app/actions/retail-actions";
import { AddBookClient } from "./AddBookClient";

export const dynamic = "force-dynamic";

export default async function AddBookPage() {
  const res = await getRetailBooks();
  const books = res.success ? res.data : [];

  return <AddBookClient existingBooks={books} />;
}
