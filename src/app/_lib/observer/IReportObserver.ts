// src/observer/ReportObserver.ts
import { CustomReport } from "../builder/CustomReport";

export interface ReportObserver {
  update(report: CustomReport): void;
}
