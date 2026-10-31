"use client";

import { useEffect, useRef, useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { dataUrlToBytes, downloadPdf, type PdfImagePage } from "@/lib/print-pdf";
import type { DetailedInfoPage } from "./detailed-info-layout";
import { renderDetailedPageToCanvas } from "./detailed-info-canvas";

interface DetailedInfoPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pages: DetailedInfoPage[];
  fontSizePx: number;
  bold: boolean;
  fileName: string;
}

/**
 * PDF preview for the "Print Detailed Info" report. Each page is rendered from
 * the very same canvas that ends up inside the downloaded file, so the preview
 * is exactly what gets saved.
 */
export default function DetailedInfoPreview({
  open,
  onOpenChange,
  pages,
  fontSizePx,
  bold,
  fileName,
}: DetailedInfoPreviewProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [rendering, setRendering] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const imagesRef = useRef<PdfImagePage[]>([]);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    const urls: string[] = [];
    imagesRef.current = [];
    setPreviewUrls([]);
    setRendering(true);

    const render = async () => {
      const images: PdfImagePage[] = [];

      for (const page of pages) {
        const canvas = renderDetailedPageToCanvas(page, {
          fontSizePx,
          bold,
          scale: 2,
        });
        const bytes = dataUrlToBytes(canvas.toDataURL("image/jpeg", 0.92));
        images.push({ data: bytes, width: canvas.width, height: canvas.height });

        const buffer = new ArrayBuffer(bytes.length);
        new Uint8Array(buffer).set(bytes);
        const url = URL.createObjectURL(
          new Blob([buffer], { type: "image/jpeg" })
        );
        urls.push(url);

        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }

        setPreviewUrls([...urls]);
        // Free the backing store before rendering the next page.
        canvas.width = 0;
        canvas.height = 0;
        // Yield so the spinner keeps painting between pages.
        await new Promise((resolve) => setTimeout(resolve, 0));
      }

      if (cancelled) return;
      imagesRef.current = images;
      setRendering(false);
    };

    void render();

    return () => {
      cancelled = true;
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [open, pages, fontSizePx, bold]);

  const handleDownload = () => {
    if (imagesRef.current.length === 0) return;
    setIsDownloading(true);
    try {
      downloadPdf(imagesRef.current, `${fileName}.pdf`);
      toast.success("PDF downloaded");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate the PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl w-[95vw] h-[90dvh] grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-sm font-black uppercase italic text-primarycolor flex items-center gap-2">
            <FileText className="size-4" /> PDF Preview — Store Detailed Info
          </DialogTitle>
          <p className="text-[10px] font-bold text-muted-foreground break-all">
            {fileName}.pdf
          </p>
        </DialogHeader>

        <div className="min-h-0 overflow-auto rounded-2xl bg-slate-100 p-4">
          {previewUrls.length > 0 ? (
            <div className="flex flex-col items-center gap-5">
              {previewUrls.map((url, index) => (
                <div
                  key={index}
                  className="w-full max-w-[960px] bg-white shadow-xl overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Page ${index + 1}`}
                    className="block w-full h-auto"
                  />
                </div>
              ))}
              {rendering && (
                <div className="flex items-center gap-2 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <Loader2 className="size-3.5 animate-spin" /> Rendering page{" "}
                  {previewUrls.length + 1} of {pages.length}
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" /> Preparing preview
            </div>
          )}
        </div>

        <DialogFooter>
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 rounded-2xl h-10 font-black uppercase tracking-widest text-[9px] border-2"
            >
              Close
            </Button>
            <Button
              onClick={handleDownload}
              disabled={rendering || isDownloading}
              className="flex-1 rounded-2xl h-10 font-black uppercase tracking-widest text-[9px] bg-primarycolor hover:bg-secondarycolor text-white shadow-lg gap-1.5"
            >
              {isDownloading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              Download PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
