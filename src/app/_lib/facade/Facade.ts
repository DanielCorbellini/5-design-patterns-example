import { PayPalAdapter, PayPalSDK } from "../adapter/PayPalAdapter";
import { EnvioService } from "./EnvioService";
import { EstoqueService } from "./EstoqueService";
import { PagamentoService } from "./PagamentoService";

export class Facade {
  protected paymentService: PagamentoService;
  protected stockService: EstoqueService;
  protected envioService: EnvioService;

  constructor(
    paymentService?: PagamentoService,
    stockService?: EstoqueService,
    envioService?: EnvioService
  ) {
    // Strategy padrão (pode ser configurável)
    const defaultPaymentStrategy = new PayPalAdapter(new PayPalSDK());

    this.paymentService =
      paymentService || new PagamentoService(defaultPaymentStrategy);
    this.stockService = stockService || new EstoqueService();
    this.envioService = envioService || new EnvioService();
  }

  // Permite trocar método de pagamento dinamicamente
  public configurarPagamento(strategy: IPagamento): void {
    this.paymentService.setPagamentoStrategy(strategy);
  }

  public realizarCompra(valor: number): CompraResultado {
    const pagamentoOk = this.paymentService.comprar(valor);
    if (!pagamentoOk) return { sucesso: false, mensagem: "Falha no pagamento" };

    this.stockService.reduzirEstoque();
    this.envioService.enviar();

    return { sucesso: true, mensagem: "Compra realizada com sucesso!" };
  }
}

class CompraResultado {
  sucesso?: boolean;
  mensagem?: string;
}
