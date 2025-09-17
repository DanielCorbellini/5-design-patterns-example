export class PicPayAdapter implements IPagamento {
  protected picpayApi;
  constructor(picpayApi: PicPaySDK) {
    this.picpayApi = picpayApi;
  }

  pagar(valor: number) {
    return this.picpayApi.processPayment(valor);
  }
}

export class PicPaySDK {
  processPayment(valor: number) {
    console.log(`PicPay: Processando pagamento de R$ ${valor}`);
    return Math.random() > 0.15; // 85% de sucesso
  }
}
