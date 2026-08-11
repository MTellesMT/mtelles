import { supabase } from "@/lib/supabase";

const PEDIDOS = "pedidos";
const PRODUTOS = "produtos";
const MOVIMENTACOES = "movimentacoes";

/*
 * STATUS QUE SERÁ EXIBIDO
 * NO RELATÓRIO
 *
 * REGRA:
 *
 * ENTREGUE + EXCLUÍDO
 * continua ENTREGUE.
 *
 * Qualquer outro status + EXCLUÍDO
 * passa a aparecer como EXCLUIDO.
 */

function obterStatusRelatorio(pedido: {
  status: string;
  excluido?: boolean | null;
}) {
  if (
    pedido.status === "ENTREGUE"
  ) {
    return "ENTREGUE";
  }

  if (pedido.excluido) {
    return "EXCLUIDO";
  }

  return pedido.status;
}

export async function getResumoRelatorio() {
  /*
   * PEDIDOS
   *
   * Aqui buscamos inclusive os pedidos
   * excluídos porque o relatório precisa
   * preservar o histórico.
   */

  const {
    data: pedidos,
    error: erroPedidos,
  } = await supabase
    .from(PEDIDOS)
    .select(`
      id,
      nome_cliente,
      status,
      total,
      created_at,
      excluido,
      excluido_em
    `)
    .order("created_at", {
      ascending: false,
    });

  if (erroPedidos) {
    throw erroPedidos;
  }

  console.log(
    "PEDIDOS:",
    pedidos
  );

  /*
   * PRODUTOS
   */

  const {
    data: produtos,
    error: erroProdutos,
  } = await supabase
    .from(PRODUTOS)
    .select(
      "id,nome,codigo,marca,cores,estoque"
    );

  if (erroProdutos) {
    throw erroProdutos;
  }

  console.log(
    "PRODUTOS:",
    produtos
  );

  /*
   * MOVIMENTAÇÕES
   */

  const {
    data: movimentacoes,
    error: erroMovimentacoes,
  } = await supabase
    .from(MOVIMENTACOES)
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (erroMovimentacoes) {
    throw erroMovimentacoes;
  }

  /*
   * PEDIDOS ENTREGUES
   *
   * IMPORTANTE:
   *
   * Um pedido entregue continua sendo
   * considerado entregue mesmo que tenha
   * sido posteriormente excluído da área
   * operacional de Pedidos.
   *
   * Dessa forma preservamos o faturamento
   * histórico da loja.
   */

  const pedidosEntregues =
    pedidos?.filter(
      (pedido) =>
        pedido.status ===
        "ENTREGUE"
    ) ?? [];

  /*
   * FATURAMENTO
   *
   * Somente pedidos efetivamente
   * entregues entram no faturamento.
   *
   * ENTREGUE + excluido = continua contando.
   *
   * PENDENTE/ENVIADO/CANCELADO + excluido
   * = não entra no faturamento.
   */

  const faturamento =
    pedidosEntregues.reduce(
      (
        total,
        pedido
      ) =>
        total +
        Number(
          pedido.total
        ),
      0
    );

  /*
   * ESTOQUE TOTAL
   */

  const estoqueTotal =
    produtos?.reduce(
      (
        total,
        produto
      ) =>
        total +
        Number(
          produto.estoque
        ),
      0
    ) ?? 0;

  /*
   * PRODUTOS COM
   * BAIXO ESTOQUE
   */

  const produtosBaixoEstoque =
    produtos?.filter(
      (produto) =>
        Number(
          produto.estoque
        ) <= 5
    ) ?? [];

  /*
   * VALOR MÉDIO DOS
   * PEDIDOS ENTREGUES
   */

  const valorMedioPedido =
    pedidosEntregues.length ===
    0
      ? 0
      : faturamento /
        pedidosEntregues.length;

  /*
   * PERCENTUAL DE
   * PEDIDOS ENTREGUES
   */

  const percentualEntregues =
    pedidos?.length === 0
      ? 0
      : (pedidosEntregues.length *
          100) /
        (pedidos?.length ?? 1);

  console.log(
    "BAIXO ESTOQUE:",
    produtosBaixoEstoque
  );

  /*
   * RETORNO DO RELATÓRIO
   */

  return {
    totalPedidos:
      pedidos?.length ?? 0,

    pedidosEntregues:
      pedidosEntregues.length,

    faturamento,

    estoqueTotal,

    valorMedioPedido,

    percentualEntregues,

    /*
     * BAIXO ESTOQUE
     */

    produtosBaixoEstoque:
      produtosBaixoEstoque.map(
        (produto) => ({
          marca:
            produto.marca,

          nome:
            produto.nome,

          estoque:
            Number(
              produto.estoque
            ),
        })
      ),

    /*
     * MOVIMENTAÇÕES
     */

    movimentacoes:
      movimentacoes ?? [],

    /*
     * PEDIDOS
     *
     * Aqui aplicamos o status visual
     * correto para o relatório.
     */

    pedidos:
      pedidos?.map(
        (pedido) => ({
          id:
            pedido.id,

          cliente:
            pedido.nome_cliente,

          status:
            obterStatusRelatorio(
              pedido
            ),

          total:
            Number(
              pedido.total
            ),

          created_at:
            pedido.created_at,

          excluido:
            pedido.excluido ??
            false,

          excluido_em:
            pedido.excluido_em ??
            null,
        })
      ) ?? [],

    /*
     * PRODUTOS
     */

    produtos:
      produtos?.map(
        (produto) => ({
          id:
            produto.id,

          nome:
            produto.nome,

          codigo:
            produto.codigo,

          marca:
            produto.marca,

          cores:
            produto.cores,

          estoque:
            Number(
              produto.estoque
            ),
        })
      ) ?? [],
  };
}