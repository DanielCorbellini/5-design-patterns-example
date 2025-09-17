export class PayPalAdapter implements IPagamento {
  protected paypalApi;
  constructor(paypalApi: PayPalSDK) {
    this.paypalApi = paypalApi;
  }

  pagar(valor: number) {
    return this.paypalApi.processPayment(valor);
  }
}

export class PayPalSDK {
  processPayment(valor: number) {
    console.log(`PayPal: Processando pagamento de R$ ${valor}`);
    return Math.random() > 0.1; // 90% de sucesso
  }
}
