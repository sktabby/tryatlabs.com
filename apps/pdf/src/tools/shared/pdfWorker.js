import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";
import workerUrl from "pdfjs-dist/build/pdf.worker.min?url";

export function ensurePdfWorker() {
  GlobalWorkerOptions.workerSrc = workerUrl;
}
