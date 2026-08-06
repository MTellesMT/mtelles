"use client";

import { useCallback, useEffect, useState } from "react";

import {
  atualizarStatusPedido,
  getItensPedido,
  getPedidos,
} from "@/services/pedidos";

export default function PedidosPage() {
 const [pedidos, setPedidos] = useState<any[]>([]);

const [loading, setLoading] = useState(true);

const [filtroStatus, setFiltroStatus] =
  useState("TODOS");

const [busca, setBusca] = useState("");

const [pedidoSelecionado, setPedidoSelecionado] =
  useState<any | null>(null);

const [modalAberto, setModalAberto] =
  useState(false);

const [itensPedido, setItensPedido] =
  useState<any[]>([]);
  
const pedidosPendentes = pedidos.filter(
  (pedido) => pedido.status === "PENDENTE"
);

const pedidosEntregues = pedidos.filter(
  (pedido) => pedido.status === "ENTREGUE"
);

const pedidosFiltrados = pedidos.filter((pedido) => {
  const texto = busca.trim().toLowerCase();

  const correspondeStatus =
    filtroStatus === "TODOS" ||
    pedido.status === filtroStatus;

  const correspondeBusca =
    texto === "" ||
    pedido.nome_cliente
      ?.toLowerCase()
      .includes(texto) ||
    String(pedido.telefone ?? "")
      .toLowerCase()
      .includes(texto);

  return correspondeStatus && correspondeBusca;
});

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

       <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

  <div>

    <h1 className="text-4xl font-black">
      Pedidos
    </h1>

    <p className="mt-2 text-[#F3E8D7]/70">
      Gerencie todos os pedidos da MTelles.
    </p>

  </div>

  <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row">

  <select
    value={filtroStatus}
    onChange={(e) => setFiltroStatus(e.target.value)}
    className="rounded-2xl border border-[#C8A95B]/20 bg-[#181818] px-5 py-3 text-white outline-none transition focus:border-[#C8A95B]"
  >
    <option value="TODOS">Todos</option>
    <option value="PENDENTE">Pendentes</option>
    <option value="ENVIADO">Enviados</option>
    <option value="ENTREGUE">Entregues</option>
    <option value="CANCELADO">Cancelados</option>
  </select>

  <input
    type="text"
    placeholder="Buscar por cliente ou telefone..."
    value={busca}
    onChange={(e) => setBusca(e.target.value)}
    className="w-full rounded-2xl border border-[#C8A95B]/20 bg-[#181818] px-5 py-3 text-white outline-none transition focus:border-[#C8A95B] lg:w-96"
  />

</div>

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

</div>

<div className="overflow-hidden rounded-3xl border border-[#C8A95B]/20 bg-[#181818]">
  <table className="w-full">

    <thead className="bg-[#C8A95B]/10">

      <tr>

        <th className="p-4 text-left">Cliente</th>

        <th className="p-4 text-left">Telefone</th>
        
<th className="p-4 text-left">Data</th>

        <th className="p-4 text-left">Total</th>

        <th className="p-4 text-left">Status</th>
<th className="p-4 text-left">
  Ações
</th>
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

      ) : pedidosFiltrados.length === 0 ? (

        <tr>

          <td
            colSpan={4}
            className="p-10 text-center text-[#F3E8D7]/70"
          >
            Nenhum pedido encontrado.
          </td>

        </tr>

      ) : (

 [...pedidosFiltrados]
  .sort(
    (a, b) =>
      new Date(b.created_at).getTime() -
      new Date(a.created_at).getTime()
  )
  .map((pedido) => (

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
  <div className="flex flex-col">
    <span>
      {new Date(pedido.created_at).toLocaleDateString("pt-BR")}
    </span>

    <span className="text-xs text-[#F3E8D7]/60">
      {new Date(pedido.created_at).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  </div>
</td>

<td className="p-4">
  {Number(pedido.total).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })}
</td>

<td className="p-4">
  <span
    className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
      pedido.status === "PENDENTE"
        ? "bg-yellow-500/20 text-yellow-400"
        : pedido.status === "ENVIADO"
        ? "bg-purple-500/20 text-purple-400"
        : pedido.status === "ENTREGUE"
        ? "bg-green-500/20 text-green-400"
        : pedido.status === "CANCELADO"
        ? "bg-red-500/20 text-red-400"
        : "bg-gray-500/20 text-gray-300"
    }`}
  >
    {pedido.status}
  </span>
</td>     
<td className="p-4">

  <div className="flex items-center gap-3">

   <button
  onClick={async () => {
    try {
      const itens = await getItensPedido(pedido.id);

      setItensPedido(itens);
      setPedidoSelecionado(pedido);
      setModalAberto(true);
    } catch (error) {
      console.error(error);
      alert("Não foi possível carregar os itens do pedido.");
    }
  }}
  className="rounded-lg bg-[#C8A95B] px-4 py-2 text-sm font-semibold text-[#111111] transition hover:brightness-110"
>
  Ver
</button>

    <select
    value={pedido.status}
   onChange={async (e) => {

  console.log("Alterando:", pedido.id, e.target.value);

  try {

    await atualizarStatusPedido(
      pedido.id,
      e.target.value
    );

    carregarPedidos();

  } catch (error) {

    console.error(error);

    alert("Não foi possível atualizar o status.");

  }

}}
    className="rounded-lg border border-[#C8A95B]/30 bg-[#181818] px-3 py-2 text-sm text-white outline-none"
  >

    <option value="PENDENTE">
      PENDENTE
    </option>

    <option value="ENVIADO">
      ENVIADO
    </option>

    <option value="ENTREGUE">
      ENTREGUE
    </option>

    <option value="CANCELADO">
      CANCELADO
    </option>

  </select>

</div>

</td>
          </tr>

        ))

      )}

    </tbody>

  </table>

</div>
</div>
     {modalAberto && pedidoSelecionado && (
  <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4">
    <div className="mx-auto my-8 w-full max-w-2xl rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-8">

      <div className="mb-6 flex items-center justify-between">

        <div className="flex items-center justify-between">

  <div>

    <h2 className="text-2xl font-bold">
      Detalhes do Pedido
    </h2>

    <p className="mt-1 text-sm text-[#F3E8D7]/60">
      Pedido #{pedidoSelecionado.id}
    </p>

  </div>

</div>

        <button
          onClick={() => {
            setModalAberto(false);
            setPedidoSelecionado(null);
          }}
          className="rounded-lg bg-red-500 px-4 py-2 font-semibold"
        >
          Fechar
        </button>

      </div>

      <div className="space-y-4">

        <p>
          <strong>Cliente:</strong>{" "}
          {pedidoSelecionado.nome_cliente}
        </p>

        <p>
          <strong>Telefone:</strong>{" "}
          {pedidoSelecionado.telefone}
        </p>

        <div className="flex items-center gap-2">

  <strong>Status:</strong>

  <span
    className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
      pedidoSelecionado.status === "PENDENTE"
        ? "bg-yellow-500/20 text-yellow-400"
        : pedidoSelecionado.status === "ENVIADO"
        ? "bg-purple-500/20 text-purple-400"
        : pedidoSelecionado.status === "ENTREGUE"
        ? "bg-green-500/20 text-green-400"
        : pedidoSelecionado.status === "CANCELADO"
        ? "bg-red-500/20 text-red-400"
        : "bg-gray-500/20 text-gray-300"
    }`}
  >
    {pedidoSelecionado.status}
  </span>

</div>

        <p>
          <strong>Total:</strong>{" "}
          {Number(pedidoSelecionado.total).toLocaleString(
            "pt-BR",
            {
              style: "currency",
              currency: "BRL",
            }
          )}
        </p>

        <p>
          <strong>Data:</strong>{" "}
          {new Date(
            pedidoSelecionado.created_at
          ).toLocaleString("pt-BR")}
        </p>

<hr className="border-[#C8A95B]/20" />

<h3 className="text-lg font-bold">
  Produtos
</h3>

<div className="space-y-3">

  {itensPedido.length === 0 ? (

    <p className="text-[#F3E8D7]/60">
      Nenhum produto encontrado.
    </p>

  ) : (

    itensPedido.map((item) => (

      <div
        key={item.id}
        className="rounded-xl border border-[#C8A95B]/20 bg-[#111111] p-4"
      >
      <div className="flex flex-col gap-5 md:flex-row">

 <div className="group relative h-40 w-full shrink-0 overflow-hidden rounded-2xl border border-[#C8A95B]/30 bg-[#181818] shadow-lg shadow-black/30 md:h-44 md:w-44">

  {item.imagem_principal ? (
    <img
      src={item.imagem_principal}
      alt={item.nome_produto}
      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-5xl">
      👠
    </div>
  )}

  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5" />

</div>

  <div className="flex flex-1 flex-col">

    <h4 className="text-xl font-bold text-white">
      {item.nome_produto}
    </h4>

    <p className="mt-2 text-sm text-[#F3E8D7]/70">
      Código: {item.codigo}
    </p>

    <p className="text-sm text-[#F3E8D7]/70">
      Marca: {item.marca}
    </p>

    <p className="text-sm text-[#F3E8D7]/70">
      Cor: {item.cor}
    </p>

    <p className="text-sm text-[#F3E8D7]/70">
      Tam: {item.tamanho}
    </p>

    <div className="mt-4 flex items-center gap-2">
  <span className="text-lg">📦</span>

  <span className="text-sm font-semibold text-[#F3E8D7]">
    Quantidade:
  </span>

  <span className="rounded-full bg-[#C8A95B]/15 px-3 py-1 text-sm font-bold text-[#C8A95B]">
    {item.quantidade}
  </span>
</div>

<div className="mt-6 border-t border-[#C8A95B]/10 pt-4 space-y-3">

  <div className="flex items-center justify-between">

    <span className="text-sm text-[#F3E8D7]/70">
      Preço
    </span>

    <span className="font-semibold text-[#C8A95B]">
      {Number(item.preco).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      })}
    </span>

  </div>

  <div className="flex items-center justify-between">

    <span className="text-sm text-[#F3E8D7]/70">
      Subtotal
    </span>

    <span className="font-bold text-green-400">
      {(Number(item.preco) * Number(item.quantidade)).toLocaleString(
        "pt-BR",
        {
          style: "currency",
          currency: "BRL",
        }
      )}
    </span>

  </div>

</div>
    </div>

  </div>

</div>  

    ))

  )}

</div>

      </div>

    </div>
  </div>
)} 

    </main>
  );
}