// src/observer/ReportSubject.ts
import { CustomReport } from "../builder/CustomReport";
import { ReportObserver } from "./IReportObserver";

export class ReportSubject {
  private observers = new Set<ReportObserver>();

  // subscribe retorna função de unsubscribe para conveniência
  subscribe(observer: ReportObserver): void {
    this.observers.add(observer);
    // return () => this.unsubscribe(observer);
  }

  unsubscribe(observer: ReportObserver) {
    this.observers.delete(observer);
  }

  notify(report: CustomReport) {
    // notificação segura, cada observer não quebra o loop
    for (const observer of this.observers) {
      try {
        observer.update(report);
      } catch (err) {
        console.error("Observer error:", err);
      }
    }
  }
}
