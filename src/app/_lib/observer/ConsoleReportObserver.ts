import { ReportObserver } from "./IReportObserver";
import { CustomReport } from "../builder/CustomReport";

// Funcionalidade do observer
export class ConsoleReportObserver implements ReportObserver {
  update(report: CustomReport): void {
    console.log("Relatório atualizado:", {
      title: report.title,
      content: report.content,
      footer: report.footer,
    });
  }
}
