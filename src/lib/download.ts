"use client";

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Header,
  Footer,
  PageNumber,
  TabStopType,
  TabStopPosition,
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
      y: element.getBoundingClientRect().y
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

  const lines = letterContent.split("\n");

  const headerText = "SECRETARÍA DE INNOVACIÓN DE LA PRESIDENCIA";
  const footerText =
    "Alameda Doctor Manuel Enrique Araujo No 5500, San Salvador, El Salvador, C.A.\nwww.presidencia.gob.sv";

  let isSignatureBlock = false;
  const signatureKeywords = [
    "DANIEL ERNESTO MÉNDEZ CABRERA",
    "DENIS ERNESTO POCASANGRE QUIJADA",
    "LIC. JUAN CARLOS RODRÍGUEZ",
    "LICENCIADO JERSON ROGELIO POSADA MOLINA",
  ];

  const doc = new Document({
    styles: {
      paragraphStyles: [
        {
          id: "bodyText",
          name: "Body Text",
          basedOn: "Normal",
          next: "Normal",
          run: {
            font: "Century Gothic",
            size: 21, // 10.5pt
          },
          paragraph: {
            alignment: AlignmentType.JUSTIFIED,
          },
        },
      ],
    },
    sections: [
      {
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: headerText,
                    bold: true,
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({ text: "" }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: footerText.split("\n").map(
                  (line) =>
                    new TextRun({
                      children: [line],
                      break: 1,
                    })
                ),
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        properties: {
          page: {
            margin: {
              top: 1440, // ~1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: [
          ...lines.map((line) => {
            const trimmedLine = line.trim();

            if (trimmedLine.startsWith("San Salvador,") || trimmedLine.startsWith("Oficio SI No.")) {
              return new Paragraph({
                children: [
                  new TextRun({
                    text: trimmedLine,
                  }),
                ],
                style: "bodyText",
                alignment: AlignmentType.RIGHT,
              });
            }

            if (trimmedLine.endsWith(":") && trimmedLine === trimmedLine.toUpperCase()) {
              return new Paragraph({
                children: [
                  new TextRun({
                    text: trimmedLine,
                    bold: true,
                  }),
                ],
                style: "bodyText",
                alignment: AlignmentType.LEFT,
              });
            }
            
            // Heuristic for signature block start
            if (signatureKeywords.some(keyword => trimmedLine.includes(keyword))) {
                isSignatureBlock = true;
            }

            if (isSignatureBlock && trimmedLine.length > 0) {
                let align = AlignmentType.LEFT;
                // Center the main signee
                if (trimmedLine.includes("DANIEL ERNESTO MÉNDEZ CABRERA") || trimmedLine.includes("SECRETARIO DE INNOVACIÓN")) {
                    align = AlignmentType.CENTER;
                }
                 if (trimmedLine.includes("DENIS ERNESTO POCASANGRE QUIJADA") || trimmedLine.includes("SUBSECRETARIO DE INNOVACIÓN")) {
                    align = AlignmentType.CENTER;
                }

                return new Paragraph({
                    children: [
                        new TextRun({
                            text: trimmedLine,
                            bold: true,
                        }),
                    ],
                    style: "bodyText",
                    alignment: align,
                });
            }


            return new Paragraph({
              text: line, // Use original line to preserve spacing between paragraphs
              style: "bodyText",
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
