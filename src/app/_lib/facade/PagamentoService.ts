export class PagamentoService {
  constructor(private pagamentoStrategy: IPagamento) {
    this.pagamentoStrategy = pagamentoStrategy;
  }

  // Armazena qual pagamento irá utilizar e permite trocar a estratégia de pagamento
  setPagamentoStrategy(strategy: IPagamento): void {
    this.pagamentoStrategy = strategy;
    console.log(
      `Forma de pagamento alterada para: ${strategy.constructor.name}`
    );
  }

  comprar(valor: number): boolean {
    console.log(`Processando pagamento de R$ ${valor}`);
    // Usa o pagamento definido aqui
    const resultado = this.pagamentoStrategy.pagar(valor);

    if (resultado) {
      console.log("Pagamento processado com sucesso");
    } else {
      console.log("Falha no pagamento");
    }

    return resultado;
  }
}
