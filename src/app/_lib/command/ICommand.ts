export interface ICommand {
  execute(): Promise<Uint8Array>;
}
