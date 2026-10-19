// Minimal, dependency-free PDF writer.
//
// Every page is a full-page JPEG image. That keeps Amharic (Ethiopic) text
// working without having to embed and subset a Unicode font into the PDF,
// which the base-14 PDF fonts cannot represent.

const A4_WIDTH_PT = 595.28;
const A4_HEIGHT_PT = 841.89;

export interface PdfImagePage {
  data: Uint8Array;
  width: number;
  height: number;
}

const encoder = new TextEncoder();

export function dataUrlToBytes(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1] ?? "";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function buildPdfFromImages(pages: PdfImagePage[]): Uint8Array {
  const chunks: Uint8Array[] = [];
  let length = 0;

  const pushText = (text: string) => {
    const bytes = encoder.encode(text);
    chunks.push(bytes);
    length += bytes.length;
  };
  const pushBytes = (bytes: Uint8Array) => {
    chunks.push(bytes);
    length += bytes.length;
  };

  const pageCount = pages.length;
  const kids = pages.map((_, index) => `${3 + index * 3} 0 R`).join(" ");

  pushText("%PDF-1.4\n");
  // Binary marker so tools treat the file as binary, not text.
  pushBytes(new Uint8Array([0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));

  const offsets: number[] = [];

  offsets[1] = length;
  pushText("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  offsets[2] = length;
  pushText(
    `2 0 obj\n<< /Type /Pages /Kids [${kids}] /Count ${pageCount} >>\nendobj\n`
  );

  pages.forEach((page, index) => {
    const pageObj = 3 + index * 3;
    const imageObj = pageObj + 1;
    const contentObj = pageObj + 2;

    offsets[pageObj] = length;
    pushText(
      `${pageObj} 0 obj\n<< /Type /Page /Parent 2 0 R ` +
        `/MediaBox [0 0 ${A4_WIDTH_PT} ${A4_HEIGHT_PT}] ` +
        `/Resources << /XObject << /Im0 ${imageObj} 0 R >> /ProcSet [/PDF /ImageC] >> ` +
        `/Contents ${contentObj} 0 R >>\nendobj\n`
    );

    offsets[imageObj] = length;
    pushText(
      `${imageObj} 0 obj\n<< /Type /XObject /Subtype /Image ` +
        `/Width ${page.width} /Height ${page.height} ` +
        `/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode ` +
        `/Length ${page.data.length} >>\nstream\n`
    );
    pushBytes(page.data);
    pushText("\nendstream\nendobj\n");

    const content = `q\n${A4_WIDTH_PT} 0 0 ${A4_HEIGHT_PT} 0 0 cm\n/Im0 Do\nQ\n`;
    offsets[contentObj] = length;
    pushText(
      `${contentObj} 0 obj\n<< /Length ${content.length} >>\nstream\n${content}endstream\nendobj\n`
    );
  });

  // Catalog + page tree + (page, image, content) per page.
  const objectCount = 2 + pageCount * 3;
  const xrefOffset = length;
  let xref = `xref\n0 ${objectCount + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objectCount; i++) {
    xref += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  pushText(xref);
  pushText(
    `trailer\n<< /Size ${objectCount + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`
  );

  const output = new Uint8Array(length);
  let position = 0;
  for (const chunk of chunks) {
    output.set(chunk, position);
    position += chunk.length;
  }
  return output;
}

export function downloadPdf(pages: PdfImagePage[], fileName: string): void {
  const pdf = buildPdfFromImages(pages);
  const buffer = new ArrayBuffer(pdf.length);
  new Uint8Array(buffer).set(pdf);
  const blob = new Blob([buffer], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
