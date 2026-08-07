import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface ResumoOperacionalProps {
  loading: boolean;
  totalPedidos: number;
  pedidosEntregues: number;
  percentualEntregues: number;

  produtos: {
    id: number;
    nome: string;
    codigo: string;
    marca: string;
    cores: string;
    estoque: number;
  }[];
  
produtosBaixoEstoque: {
  marca: string;
  nome: string;
  estoque: number;
}[];

  pedidos: {
  id: number;
  cliente: string;
  status: string;
  total: number;
  created_at: string;
}[];

}

export default function ResumoOperacional({
 loading,
totalPedidos,
pedidosEntregues,
percentualEntregues,
produtos,
pedidos,
produtosBaixoEstoque,

}: ResumoOperacionalProps) {

    const [mostrarProdutos, setMostrarProdutos] =
  useState(false);

const [mostrarBaixoEstoque, setMostrarBaixoEstoque] =
  useState(false);

const [mostrarPedidos, setMostrarPedidos] =
  useState(false);
  return (
    <section className="mt-12">

      <h2 className="border-b border-[#C8A95B]/30 pb-3 text-2xl font-black text-[#C8A95B]">
        RESUMO OPERACIONAL
      </h2>

      <div className="mt-8 space-y-5">

        <div className="border-b border-[#2A2A2A] pb-3">

  <button
    type="button"
    onClick={() =>
      setMostrarProdutos(!mostrarProdutos)
    }
    className="flex w-full items-center justify-between"
  >
    <div className="flex items-center gap-2">

      {mostrarProdutos ? (
        <ChevronDown size={18} />
      ) : (
        <ChevronRight size={18} />
      )}

      <span>
        Produtos cadastrados
      </span>

    </div>

    <strong>
      {loading ? "--" : produtos.length}
    </strong>

  </button>
{mostrarProdutos && (

  <div className="mt-5 overflow-hidden rounded-2xl border border-[#2A2A2A]">

    <table className="w-full">

      <thead className="bg-[#181818]">

        <tr>

          <th className="p-4 text-left">
            Produto
          </th>

          <th className="p-4 text-left">
            Código
          </th>

          <th className="p-4 text-left">
            Marca
          </th>

          <th className="p-4 text-left">
            Cor
          </th>

        </tr>

      </thead>

      <tbody>

        {produtos.map((produto) => (

          <tr
            key={produto.id}
            className="border-t border-[#2A2A2A]"
          >

            <td className="p-4">
              {produto.nome}
            </td>

            <td className="p-4">
              {produto.codigo}
            </td>

            <td className="p-4">
              {produto.marca}
            </td>

            <td className="p-4">
              {produto.cores}
            </td>

          </tr>

        ))}

      </tbody>

    </table>

  </div>

)}

</div>
<div className="border-b border-[#2A2A2A] pb-3">

  <button
    type="button"
    onClick={() =>
      setMostrarPedidos(!mostrarPedidos)
    }
    className="flex w-full items-center justify-between"
  >

    <div className="flex items-center gap-2">

      {mostrarPedidos ? (
        <ChevronDown size={18} />
      ) : (
        <ChevronRight size={18} />
      )}

      <span>
        Pedidos cadastrados
      </span>

    </div>

    <strong>
      {loading ? "--" : pedidos.length}
    </strong>

  </button>
{mostrarPedidos && (

  <div className="mt-5 overflow-hidden rounded-2xl border border-[#2A2A2A]">

    <table className="w-full">

      <thead className="bg-[#181818]">

        <tr>

          <th className="p-4 text-left">
            Cliente
          </th>

          <th className="p-4 text-left">
            Status
          </th>

          <th className="p-4 text-left">
            Total
          </th>

          <th className="p-4 text-left">
            Data
          </th>

        </tr>

      </thead>

      <tbody>

        {pedidos.length === 0 ? (

          <tr>

            <td
              colSpan={4}
              className="p-6 text-center text-[#F3E8D7]/60"
            >
              Nenhum pedido encontrado.
            </td>

          </tr>

        ) : (

          pedidos.map((pedido) => (

            <tr
              key={pedido.id}
              className="border-t border-[#2A2A2A]"
            >

              <td className="p-4">
                {pedido.cliente}
              </td>

              <td className="p-4">
                {pedido.status}
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
                {new Date(
                  pedido.created_at
                ).toLocaleDateString("pt-BR")}
              </td>

            </tr>

          ))

        )}

      </tbody>

    </table>

  </div>

)}
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

<div className="border-b border-[#2A2A2A] pb-3">

  <button
    type="button"
    onClick={() =>
      setMostrarBaixoEstoque(!mostrarBaixoEstoque)
    }
    className="flex w-full items-center justify-between"
  >

    <div className="flex items-center gap-2">

      {mostrarBaixoEstoque ? (
        <ChevronDown size={18} />
      ) : (
        <ChevronRight size={18} />
      )}

      <span>
        Produtos com estoque baixo
      </span>

    </div>

    <strong className="text-orange-400">
      {loading
        ? "--"
        : produtosBaixoEstoque.length}
    </strong>

  </button>

  {mostrarBaixoEstoque && (

    <div className="mt-5 overflow-hidden rounded-2xl border border-[#2A2A2A]">

      <table className="w-full">

       <tbody>

  {produtosBaixoEstoque.length === 0 ? (

    <tr>

      <td
        colSpan={3}
        className="p-6 text-center text-green-400"
      >
        Nenhum produto com estoque baixo.
      </td>

    </tr>

  ) : (

    produtosBaixoEstoque.map((produto) => (

      <tr
        key={`${produto.marca}-${produto.nome}`}
        className="border-t border-[#2A2A2A]"
      >

        <td className="w-1/4 p-4">
          {produto.marca}
        </td>

        <td className="w-2/4 p-4">
          {produto.nome}
        </td>

        <td
          className={`w-1/4 p-4 text-center font-bold ${
            produto.estoque === 0
              ? "text-red-400"
              : "text-orange-400"
          }`}
        >
          {produto.estoque}
        </td>

      </tr>

    ))

  )}

</tbody>
       

      </table>

    </div>

  )}

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