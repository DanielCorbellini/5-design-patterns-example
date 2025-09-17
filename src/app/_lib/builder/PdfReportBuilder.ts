import { CustomReport } from "./CustomReport";
import { PDFDocument, PDFFont, PDFPage, StandardFonts } from "pdf-lib";
import { ReportBuilder } from "./ReportBuilder";
import { ReportSubject } from "../observer/ReportSubject";
import { ReportObserver } from "../observer/IReportObserver";

export class PdfReportBuilder implements ReportBuilder {
  private report = new CustomReport();
  private pdfDoc!: PDFDocument;
  private page!: PDFPage;
  private font!: PDFFont;
  private width!: number;
  private height!: number;
  private currentY!: number;

  private subject?: ReportSubject;

  constructor() {
    this.subject = new ReportSubject();
  }

  // Não foi feito no construtor porque precisava que a função fosse async
  async init() {
    this.pdfDoc = await PDFDocument.create();
    this.page = this.pdfDoc.addPage();
    this.font = await this.pdfDoc.embedFont(StandardFonts.TimesRoman);
    const { width, height } = this.page.getSize();
    this.width = width;
    this.height = height;
    this.currentY = height - 50;
  }

  subscribe(observer: ReportObserver) {
    return this.subject?.subscribe(observer);
  }

  setTitle(title: string): void {
    this.report.title = title;
    this.page.drawText(title, {
      x: 50,
      y: this.currentY,
      size: 24,
      font: this.font,
      color: undefined,
    });
    this.currentY -= 30;
  }

  setSection(section: string): void {
    // Adiciona o section na array
    this.report.content?.push(section);
    this.page.drawText(section + "\n", {
      x: 50,
      y: this.currentY,
      size: 12,
      font: this.font,
      maxWidth: this.width - 100,
    });
    this.currentY -= 20;
  }

  setFooter(footer: string): void {
    this.report.footer = footer;
    const textWidth = this.font.widthOfTextAtSize(footer, 10);
    const x = (this.width - textWidth) / 2;
    const y = 20;

    this.page.drawText(footer, {
      x,
      y,
      size: 10,
      font: this.font,
      color: undefined,
    });
    this.currentY = y - 20;
  }

  build(): CustomReport {
    // Notifica os observers
    this.subject?.notify(this.report);
    return this.report;
  }

  async generatePdfBytes(): Promise<Uint8Array> {
    return await this.pdfDoc.save();
  }
}
