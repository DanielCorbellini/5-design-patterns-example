"use client";

import { useState } from "react";
import { PdfReportBuilder } from "./_lib/builder/PdfReportBuilder";
import { ConsoleReportObserver } from "./_lib/observer/ConsoleReportObserver";
import { Facade } from "./_lib/facade/Facade";
import { PayPalAdapter, PayPalSDK } from "./_lib/adapter/PayPalAdapter";
import { PicPayAdapter, PicPaySDK } from "./_lib/adapter/PicPayAdapter";

export default function Home() {
  // Implementação facade + adapter
  const [formaPagamento, setFormaPagamento] = useState<"paypal" | "picpay">(
    "paypal"
  );

  const [resultado, setResultado] = useState<string>("");

  const facade = new Facade();

  const handlePagamento = () => {
    if (formaPagamento === "paypal")
      facade.configurarPagamento(new PayPalAdapter(new PayPalSDK()));

    if (formaPagamento === "picpay")
      facade.configurarPagamento(new PicPayAdapter(new PicPaySDK()));

    const res = facade.realizarCompra(11249);
    setResultado(res.mensagem ?? "");
  };

  // Implementação builder + observer
  const gerarRelatorio = async () => {
    const builder = new PdfReportBuilder();
    await builder.init();

    const observer = new ConsoleReportObserver();
    builder.subscribe(observer);

    builder.setTitle("Relatório de Compras");
    builder.setSection(`Seção 1: Forma de pagamento: ${formaPagamento}`);
    builder.setSection(`Seção 2: Preço R$11.249`);
    builder.setSection(`Seção 3: ${resultado}`);
    builder.setFooter("© 2025 Minha Loja");

    builder.build();

    // gerar bytes do PDF
    const pdfBytes = await builder.generatePdfBytes();

    // criar blob e link para download
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "relatorio.pdf";
    link.click();

    // liberar memória
    URL.revokeObjectURL(url);
  };

  // Adicionais
  const [comprou, setComprou] = useState<boolean>(false);

  return (
    <div className="container">
      <h1>🛒 Sistema de Compras</h1>

      <div className="product-info">
        <h3>📱 iPhone 17 Pro Max</h3>
        <p>
          <strong>Produto ID:</strong> <span id="produto-id">123</span>
        </p>
        <p>
          <strong>Usuário ID:</strong> <span id="usuario-id">456</span>
        </p>
        <p>
          <strong>Valor:</strong> R$ <span id="valor">11.249</span>
        </p>
      </div>

      <div className="payment-section">
        <h3>💳 Escolha a forma de pagamento:</h3>
        <div className="payment-buttons">
          <button
            className="payment-btn paypal"
            onClick={() => setFormaPagamento("paypal")}
          >
            💙 PayPal
          </button>
          <button
            className="payment-btn picpay"
            onClick={() => setFormaPagamento("picpay")}
          >
            💚 PicPay
          </button>
        </div>
      </div>

      <button
        id="comprar-btn"
        className="buy-btn"
        onClick={() => {
          handlePagamento();
          setComprou(true);
        }}
      >
        🛍️ Realizar Compra
      </button>

      <button
        id="comprar-btn"
        className="buy-btn"
        onClick={gerarRelatorio}
        disabled={!comprou}
      >
        📄 Gerar Relatório
      </button>

      <div id="resultado">
        <p> Forma de pagamento escolhida: {formaPagamento}</p>
      </div>

      <div id="resultado">{resultado && <p>✅ {resultado}</p>}</div>
    </div>
  );
}
