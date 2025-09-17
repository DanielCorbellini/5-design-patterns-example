import { PdfReportBuilder } from "../builder/PdfReportBuilder";
import { ConsoleReportObserver } from "../observer/ConsoleReportObserver";
import { ICommand } from "./ICommand";

export class GerarRelatorioCommand implements ICommand {
  constructor(private formaPagamento: string, private resultado: string) {}

  async execute(): Promise<Uint8Array> {
    const builder = new PdfReportBuilder();
    await builder.init();

    const observer = new ConsoleReportObserver();
    builder.subscribe(observer);

    builder.setTitle("Relatório de Compras");
    builder.setSection(`Seção 1: Forma de pagamento: ${this.formaPagamento}`); // Muito comum em consultas sql
    builder.setSection(`Seção 2: Preço R$11.249`);
    builder.setSection(`Seção 3: ${this.resultado}`);
    builder.setFooter("© 2025 Minha Loja");

    builder.build();

    // gerar bytes do PDF
    const pdfBytes = await builder.generatePdfBytes();
    return pdfBytes;
  }
}
