"use client";

import { useCallback, useEffect, useState } from "react";

import {
  getPedidos,
} from "@/services/pedidos";

export default function PedidosPage() {
 const [pedidos, setPedidos] = useState<any[]>([]);

const [loading, setLoading] = useState(true);

const pedidosPendentes = pedidos.filter(
  (pedido) => pedido.status === "PENDENTE"
);

const pedidosEntregues = pedidos.filter(
  (pedido) => pedido.status === "ENTREGUE"
);

const faturamento = pedidos.reduce(
  (total, pedido) => total + Number(pedido.total),
  0
);

const carregarPedidos = useCallback(async () => {

  try {

    setLoading(true);

    const data = await getPedidos();

    setPedidos(data ?? []);

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }

}, []);

useEffect(() => {

  carregarPedidos();

}, [carregarPedidos]);

  return (
    <main className="min-h-screen bg-[#111111] p-8 text-white">
      <div className="mx-auto max-w-7xl">

        <div className="mb-10">

          <h1 className="text-4xl font-black">
            Pedidos
          </h1>

          <p className="mt-2 text-[#F3E8D7]/70">
            Gerencie todos os pedidos da MTelles.
          </p>

        </div>
<div className="mb-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">

  <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6">

    <p className="text-sm uppercase tracking-widest text-[#F3E8D7]/60">
      Pedidos
    </p>

    <h2 className="mt-3 text-4xl font-black text-[#C8A95B]">
      {pedidos.length}
    </h2>

  </div>

  <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6">

    <p className="text-sm uppercase tracking-widest text-[#F3E8D7]/60">
      Pendentes
    </p>

    <h2 className="mt-3 text-4xl font-black text-yellow-400">
      {pedidosPendentes.length}
    </h2>

  </div>

  <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6">

    <p className="text-sm uppercase tracking-widest text-[#F3E8D7]/60">
      Faturamento
    </p>

    <h2 className="mt-3 text-4xl font-black text-green-400">
      {faturamento.toLocaleString("pt-BR", {
  style: "currency",
  currency: "BRL",
})}
    </h2>

  </div>

  <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6">

    <p className="text-sm uppercase tracking-widest text-[#F3E8D7]/60">
      Entregues
    </p>

    <h2 className="mt-3 text-4xl font-black text-blue-400">
      {pedidosEntregues.length}
    </h2>

  </div>
<div className="overflow-hidden rounded-3xl border border-[#C8A95B]/20 bg-[#181818]">

  <table className="w-full">

    <thead className="bg-[#C8A95B]/10">

      <tr>

        <th className="p-4 text-left">Cliente</th>

        <th className="p-4 text-left">Telefone</th>

        <th className="p-4 text-left">Total</th>

        <th className="p-4 text-left">Status</th>

      </tr>

    </thead>

    <tbody>

      {loading ? (

        <tr>

          <td
            colSpan={4}
            className="p-10 text-center text-[#F3E8D7]/70"
          >
            Carregando pedidos...
          </td>

        </tr>

      ) : pedidos.length === 0 ? (

        <tr>

          <td
            colSpan={4}
            className="p-10 text-center text-[#F3E8D7]/70"
          >
            Nenhum pedido encontrado.
          </td>

        </tr>

      ) : (

        pedidos.map((pedido) => (

          <tr
            key={pedido.id}
            className="border-t border-[#C8A95B]/10"
          >

            <td className="p-4">
              {pedido.nome_cliente}
            </td>

            <td className="p-4">
              {pedido.telefone}
            </td>

            <td className="p-4">
              {Number(pedido.total).toLocaleString(
                "pt-BR",
                {
                  style: "currency",
                  currency: "BRL",
                }
              )}
            </td>

            <td className="p-4">
              {pedido.status}
            </td>

          </tr>

        ))

      )}

    </tbody>

  </table>

</div>
</div>
      </div>
    </main>
  );
}