"use client";

import { useState } from "react";
import { Facade } from "./_lib/facade/Facade";
import { PayPalAdapter, PayPalSDK } from "./_lib/adapter/PayPalAdapter";
import { PicPayAdapter, PicPaySDK } from "./_lib/adapter/PicPayAdapter";
import { GerarRelatorioCommand } from "./_lib/command/GerarRelatorioCommand";
import { ReportInvoker } from "./_lib/command/ReportInvoker";

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
  const handleRelatorio = async () => {
    const invoker = new ReportInvoker(
      new GerarRelatorioCommand(formaPagamento, resultado)
    );

    const pdfBytes = await invoker.execute();

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
        onClick={handleRelatorio}
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
