import { supabase } from "@/lib/supabase";

const PEDIDOS = "pedidos";
const PRODUTOS = "produtos";
const MOVIMENTACOES = "movimentacoes";

export async function getResumoRelatorio() {
  const { data: pedidos, error: erroPedidos } =
    await supabase
      .from(PEDIDOS)
      .select("total,status");

  if (erroPedidos) throw erroPedidos;

  const { data: produtos, error: erroProdutos } =
    await supabase
      .from(PRODUTOS)
      .select(
        "id,nome,codigo,marca,estoque"
      );

  if (erroProdutos) throw erroProdutos;

  const {
    data: movimentacoes,
    error: erroMovimentacoes,
  } = await supabase
    .from(MOVIMENTACOES)
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (erroMovimentacoes)
    throw erroMovimentacoes;

  const pedidosEntregues =
    pedidos?.filter(
      (pedido) =>
        pedido.status === "ENTREGUE"
    ) ?? [];

  const faturamento =
    pedidosEntregues.reduce(
      (total, pedido) =>
        total + Number(pedido.total),
      0
    );

  const estoqueTotal =
    produtos?.reduce(
      (total, produto) =>
        total +
        Number(produto.estoque),
      0
    ) ?? 0;

  const produtosBaixoEstoque =
    produtos?.filter(
      (produto) =>
        Number(produto.estoque) <= 5
    ) ?? [];

  const valorMedioPedido =
    pedidosEntregues.length === 0
      ? 0
      : faturamento /
        pedidosEntregues.length;

  const percentualEntregues =
    pedidos?.length === 0
      ? 0
      : (pedidosEntregues.length *
          100) /
        (pedidos?.length ?? 1);

  return {
    totalPedidos:
      pedidos?.length ?? 0,

    pedidosEntregues:
      pedidosEntregues.length,

    faturamento,

    estoqueTotal,

    valorMedioPedido,

    percentualEntregues,

    produtosBaixoEstoque:
      produtosBaixoEstoque.map(
        (produto) => ({
          nome: produto.nome,
          estoque: Number(
            produto.estoque
          ),
        })
      ),

    movimentacoes:
      movimentacoes ?? [],

    produtos:
      produtos?.map((produto) => ({
        id: produto.id,
        nome: produto.nome,
        codigo: produto.codigo,
        marca: produto.marca,
        estoque: Number(
          produto.estoque
        ),
      })) ?? [],
  };
}