"use client";

import { useState } from "react";

export function usePDFGenerator() {
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const generatePDF = async () => {
    if (typeof window === "undefined") return;

    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("pdf-preview");
    if (!element) return;

    setLoading(true);
    setDownloaded(false);

    try {
      await waitForImagesToLoad(element);
      await html2pdf()
        .set({
          margin: 0,
          filename: "proposta.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 1, useCORS: true },
          jsPDF: { unit: "in", format: "a4", orientation: "p" },
        })
        .from(element)
        .save();

      setDownloaded(true);
    } catch (err) {
      console.error("❌ Erro ao gerar PDF:", err);
    } finally {
      setLoading(false);
    }
  };

  return { generatePDF, loading, downloaded };
}

function waitForImagesToLoad(element: HTMLElement): Promise<void> {
  const images = Array.from(element.querySelectorAll("img"));
  return Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete) return resolve(true);
          img.onload = () => resolve(true);
          img.onerror = () => resolve(true);
        })
    )
  ).then(() => undefined);
}
