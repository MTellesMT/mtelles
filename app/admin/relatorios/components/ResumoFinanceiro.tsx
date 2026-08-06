interface ResumoFinanceiroProps {
  loading: boolean;
  faturamento: number;
  valorMedioPedido: number;
}

export default function ResumoFinanceiro({
  loading,
  faturamento,
  valorMedioPedido,
}: ResumoFinanceiroProps) {
  return (
    <section className="mt-14">

      <h2 className="border-b border-[#C8A95B]/30 pb-3 text-2xl font-black text-[#C8A95B]">
        RESUMO FINANCEIRO
      </h2>

      <div className="mt-8 space-y-5">

        <div className="flex justify-between border-b border-[#2A2A2A] pb-3">
          <span>Faturamento bruto</span>

          <strong className="text-[#C8A95B]">
            {loading
              ? "--"
              : faturamento.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
          </strong>
        </div>

        <div className="flex justify-between border-b border-[#2A2A2A] pb-3">
          <span>Valor médio por pedido</span>

          <strong className="text-green-400">
            {loading
              ? "--"
              : valorMedioPedido.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
          </strong>
        </div>

        <div className="flex justify-between border-b border-[#2A2A2A] pb-3">
          <span>Ticket médio</span>

          <strong className="text-blue-400">
            {loading
              ? "--"
              : valorMedioPedido.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
          </strong>
        </div>

      </div>

    </section>
  );
}