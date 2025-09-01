"use client";

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Header,
  Footer,
  ImageRun,
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
      scale: 2,
      useCORS: true,
      allowTaint: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "letter",
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

const fetchImageAsBuffer = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
    });
}


export const downloadAsDocx = async (letterContent: string, headerImagePath: string) => {
  if (!letterContent) return;

  const lines = letterContent.split("\n");
  
  const headerImageBuffer = await fetchImageAsBuffer(headerImagePath);

  const footerText =
    "Alameda Doctor Manuel Enrique Araujo No 5500, San Salvador, El Salvador, C.A.\nwww.presidencia.gob.sv";

  let isSignatureBlock = false;
  const signatureKeywords = [
      "DANIEL ERNESTO MÉNDEZ CABRERA",
      "SECRETARIO DE INNOVACIÓN",
      "SECRETARIO DE INNOVACIÓN DE LA PRESIDENCIA",
      "DENIS ERNESTO POCASANGRE QUIJADA",
      "SUBSECRETARIO DE INNOVACIÓN",
      "LIC. JUAN CARLOS RODRÍGUEZ",
      "COORDINADOR REGIONAL DE PROYECTOS",
      "LICENCIADO JERSON ROGELIO POSADA MOLINA",
      "MINISTRO DE HACIENDA",
      "BANCO INTERAMERICANO DE DESARROLLO",
      "E.S.D.O.",
      "SEÑOR MINISTRO",
      "SEÑORA MINISTRA",
      "SEÑOR VICEMINISTRO",
      "SEÑORA VICEMINISTRA",
      "SEÑOR DIRECTOR",
      "SEÑORA DIRECTORA",
      "SEÑOR GERENTE",
      "SEÑORA GERENTE",
      "SEÑOR JEFE",
      "SEÑORA JEFA",
      "SEÑOR PRESIDENTE",
      "SEÑORA PRESIDENTA",
      "SEÑOR COORDINADOR"
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
                  new ImageRun({
                    data: headerImageBuffer,
                    transformation: {
                      width: 612, // Letter width in points
                      height: 75, 
                    },
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
                  (line, i) =>
                    new TextRun({
                      children: [line],
                      break: i > 0 ? 1 : undefined,
                    })
                ),
                alignment: AlignmentType.CENTER,
                 style: "bodyText"
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
              isSignatureBlock = true;
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
            
            const isKeywordLine = signatureKeywords.some(keyword => trimmedLine.toUpperCase().includes(keyword));

            if (isKeywordLine && trimmedLine.length > 0) {
                 isSignatureBlock = true;
            }

            if (isSignatureBlock) {
                let align = AlignmentType.LEFT;
                
                const centeredKeywords = [
                    "DANIEL ERNESTO MÉNDEZ CABRERA",
                    "SECRETARIO DE INNOVACIÓN",
                    "SECRETARIO DE INNOVACIÓN DE LA PRESIDENCIA",
                    "DENIS ERNESTO POCASANGRE QUIJADA",
                    "SUBSECRETARIO DE INNOVACIÓN"
                ];

                if (centeredKeywords.some(keyword => trimmedLine.toUpperCase().includes(keyword))) {
                    align = AlignmentType.CENTER;
                }

                if (trimmedLine.length === 0) {
                     return new Paragraph({ text: "", style: "bodyText" });
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
              text: line, 
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
