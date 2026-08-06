interface ResumoOperacionalProps {
  loading: boolean;
  totalPedidos: number;
  pedidosEntregues: number;
  percentualEntregues: number;
}

export default function ResumoOperacional({
  loading,
  totalPedidos,
  pedidosEntregues,
  percentualEntregues,
}: ResumoOperacionalProps) {
  return (
    <section className="mt-12">

      <h2 className="border-b border-[#C8A95B]/30 pb-3 text-2xl font-black text-[#C8A95B]">
        RESUMO OPERACIONAL
      </h2>

      <div className="mt-8 space-y-5">

        <div className="flex justify-between border-b border-[#2A2A2A] pb-3">
          <span>Pedidos cadastrados</span>

          <strong>
            {loading ? "--" : totalPedidos}
          </strong>
        </div>

        <div className="flex justify-between border-b border-[#2A2A2A] pb-3">
          <span>Pedidos entregues</span>

          <strong className="text-green-400">
            {loading ? "--" : pedidosEntregues}
          </strong>
        </div>

        <div className="flex justify-between border-b border-[#2A2A2A] pb-3">
          <span>Pedidos pendentes</span>

          <strong className="text-orange-400">
            {loading ? "--" : totalPedidos - pedidosEntregues}
          </strong>
        </div>

        <div className="flex justify-between border-b border-[#2A2A2A] pb-3">
          <span>Taxa de conclusão</span>

          <strong className="text-blue-400">
            {loading
              ? "--"
              : `${percentualEntregues.toFixed(1)}%`}
          </strong>
        </div>

      </div>

    </section>
  );
}