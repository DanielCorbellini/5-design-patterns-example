import { CustomReport } from "./CustomReport";

export interface ReportBuilder {
  setTitle(title: string): void;
  setSection(section: string): void;
  setFooter(footer: string): void;
  build(): CustomReport;
}
