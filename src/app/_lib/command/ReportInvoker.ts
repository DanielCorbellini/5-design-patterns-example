import { ICommand } from "./ICommand";

export class ReportInvoker {
  constructor(private command: ICommand) {}
  execute() {
    return this.command.execute();
  }
}
