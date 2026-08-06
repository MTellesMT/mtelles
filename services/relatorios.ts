import { supabase } from "@/lib/supabase";

const PEDIDOS = "pedidos";
const PRODUTOS = "produtos";
const MOVIMENTACOES = "movimentacoes";

export async function getResumoRelatorio() {
  const { data: pedidos, error: erroPedidos } =
    await supabase
      .from(PEDIDOS)
      .select(`
  id,
  nome_cliente,
  status,
  total,
  created_at
`)
  if (erroPedidos) throw erroPedidos;

console.log("PEDIDOS:", pedidos);

  const { data: produtos, error: erroProdutos } =
    await supabase
      .from(PRODUTOS)
      .select(
  "id,nome,codigo,marca,cores,estoque"
)

  if (erroProdutos) throw erroProdutos;

console.log("PRODUTOS:", produtos);
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
        
console.log("BAIXO ESTOQUE:", produtosBaixoEstoque);
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
      marca: produto.marca,
      nome: produto.nome,
      estoque: Number(
        produto.estoque
      ),
    })
  ),
    movimentacoes:
      movimentacoes ?? [],

pedidos:
  pedidos?.map((pedido) => ({
    id: pedido.id,
    cliente: pedido.nome_cliente,
    status: pedido.status,
    total: Number(pedido.total),
    created_at: pedido.created_at,
  })) ?? [],

     produtos:
produtos?.map((produto) => ({
   id: produto.id,
  nome: produto.nome,
   codigo: produto.codigo,
   marca: produto.marca,
   cores: produto.cores,
   estoque: Number(produto.estoque),
 })) ?? [],
  };
}