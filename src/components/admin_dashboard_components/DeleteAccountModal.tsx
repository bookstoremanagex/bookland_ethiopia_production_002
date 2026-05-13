"use client";

import React, { useState } from "react";
import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteAccountModalProps {
  accountId: number;
  accountName: string;
  onDelete: (id: number) => Promise<boolean>;
}

export default function DeleteAccountModal({
  accountId,
  accountName,
  onDelete,
}: DeleteAccountModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const success = await onDelete(accountId);
    setIsDeleting(false);
    if (success) {
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="gap-2 font-bold rounded-xl shadow-lg hover:shadow-red-500/20 transition-all">
          <Trash2 className="size-4" />
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-3xl p-8 border-0 shadow-2xl">
        <DialogHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
            <AlertTriangle className="size-8 text-red-600" />
          </div>
          <DialogTitle className="text-2xl font-black text-gray-900 text-center">
            Delete Account
          </DialogTitle>
          <DialogDescription className="text-base text-gray-500 text-center">
            Are you sure you want to delete <strong className="text-gray-900">{accountName}</strong>? This action will immediately disable their access.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 justify-center sm:justify-center w-full">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="rounded-xl font-bold h-12 px-6 w-full sm:w-auto hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-xl font-black h-12 px-6 w-full sm:w-auto shadow-lg shadow-red-500/20"
          >
            {isDeleting ? (
              <>
                <Loader2 className="size-5 mr-2 animate-spin" />
                Deleting...
              </>
            ) : (
              "Yes, Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
