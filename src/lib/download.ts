"use client";

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  PageBreak,
} from "docx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export const downloadAsPdf = async (elementId: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found for PDF generation");
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher resolution
      backgroundColor: null, // Use element's background
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    const ratio = canvasWidth / pdfWidth;
    const calculatedHeight = canvasHeight / ratio;

    let heightLeft = calculatedHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, calculatedHeight);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - calculatedHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, calculatedHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save("respuesta.pdf");
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};

export const downloadAsDocx = async (letterContent: string) => {
  if (!letterContent) return;

  const lines = letterContent.split("\n").map((line) => line.trim());

  let isSignatureBlock = false;
  const signatureKeywords = [
    "DENIS ERNESTO POCASANGRE QUIJADA",
    "DANIEL ERNESTO MÉNDEZ CABRERA",
    "LIC. JUAN CARLOS RODRÍGUEZ",
  ];

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
            new Paragraph({
                children: [new TextRun("Espacio para encabezado (PNG)")],
                alignment: AlignmentType.CENTER,
            }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "" }),
            ...lines.map((line) => {
            let alignment = AlignmentType.JUSTIFIED;
            let isBold = false;
            let font = "Arial";

            if (
              line.startsWith("San Salvador,") ||
              line.startsWith("Oficio SI No.")
            ) {
              alignment = AlignmentType.RIGHT;
              font = "Century Gothic";
            }

            // Check for salutation e.g. "SEÑOR MINISTRO:"
            if (
              line.length > 0 &&
              line === line.toUpperCase() &&
              line.endsWith(":")
            ) {
              isBold = true;
            }

            // A simple heuristic to detect the start of the signature block
            if (signatureKeywords.some(keyword => line.includes(keyword))) {
              isSignatureBlock = true;
            }
            
            if (line.includes('E.S.D.O.')) {
                isSignatureBlock = true;
            }

            if (isSignatureBlock && line.length > 0) {
              isBold = true;
              alignment = AlignmentType.LEFT;
            }

            return new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  bold: isBold,
                  font: font,
                  size: (font === "Arial" ? 11 : 12) * 2, // size in half-points
                }),
              ],
              alignment: alignment,
              spacing: {
                after: 100,
              },
            });
          }),
        ],
      },
    ],
  });

  try {
    const blob = await Packer.toBlob(doc);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "respuesta.docx";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error generating DOCX:", error);
  }
};
