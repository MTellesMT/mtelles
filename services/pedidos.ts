import { supabase } from "@/lib/supabase";
import { registrarSaida } from "@/services/estoque";

const PEDIDOS = "pedidos";
const ITENS = "pedido_itens";

interface NovoPedido {
  nome_cliente: string;
  telefone: string;
  total: number;

  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  referencia: string;
}

interface NovoItemPedido {
  produto_id: number;
  nome_produto: string;
  codigo: string;
  marca: string;
  cor: string;
  tamanho: string;
  quantidade: number;
  preco: number;
  subtotal: number;
}

/*
 * CRIAR PEDIDO
 */

export async function criarPedido(
  pedido: NovoPedido,
  itens: NovoItemPedido[]
) {
  console.log("PEDIDO:", pedido);

  const {
    data: pedidoCriado,
    error,
  } = await supabase
    .from(PEDIDOS)
    .insert(pedido)
    .select()
    .single();

  console.log(
    "ERRO PEDIDO:",
    error
  );

  console.log(
    "PEDIDO CRIADO:",
    pedidoCriado
  );

  if (error) {
    throw error;
  }

  const itensPedido = itens.map(
    (item) => ({
      ...item,
      pedido_id:
        pedidoCriado.id,
    })
  );

  console.log(
    "ITENS:",
    itensPedido
  );

  const {
    error: erroItens,
  } = await supabase
    .from(ITENS)
    .insert(itensPedido);

  console.log(
    "ERRO ITENS:",
    erroItens
  );

  if (erroItens) {
    throw erroItens;
  }

  return pedidoCriado;
}

/*
 * BUSCAR PEDIDOS
 *
 * A página de pedidos não deve
 * mostrar pedidos excluídos.
 */

export async function getPedidos() {
  const {
    data,
    error,
  } = await supabase
    .from(PEDIDOS)
    .select("*")
    .eq("excluido", false)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/*
 * BUSCAR TODOS OS PEDIDOS
 *
 * Utilizado pelos relatórios,
 * pois o relatório precisa
 * conhecer também os pedidos
 * excluídos.
 */

export async function getTodosPedidos() {
  const {
    data,
    error,
  } = await supabase
    .from(PEDIDOS)
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/*
 * BUSCAR ITENS DO PEDIDO
 */

export async function getItensPedido(
  pedidoId: number
) {
  const {
    data,
    error,
  } = await supabase
    .from(ITENS)
    .select(`
      *,
      produtos (
        imagem_principal
      )
    `)
    .eq(
      "pedido_id",
      pedidoId
    );

  if (error) {
    throw error;
  }

  return (
    data?.map(
      (item: any) => ({
        ...item,

        imagem_principal:
          item.produtos
            ?.imagem_principal ??
          "",
      })
    ) ?? []
  );
}

/*
 * BUSCAR ITENS PARA
 * MOVIMENTAÇÃO DE ESTOQUE
 */

export async function getItensPedidoEstoque(
  pedidoId: number
) {
  const {
    data,
    error,
  } = await supabase
    .from(ITENS)
    .select(`
      produto_id,
      nome_produto,
      quantidade
    `)
    .eq(
      "pedido_id",
      pedidoId
    );

  if (error) {
    throw error;
  }

  return data ?? [];
}

/*
 * ATUALIZAR STATUS
 */

export async function atualizarStatusPedido(
  id: number,
  status: string
) {
  const {
    data: pedidoAtual,
    error: erroPedido,
  } = await supabase
    .from(PEDIDOS)
    .select(
      "status, excluido"
    )
    .eq(
      "id",
      id
    )
    .single();

  if (erroPedido) {
    throw erroPedido;
  }

  /*
   * Pedido excluído não pode
   * receber novas alterações
   * operacionais.
   */

  if (pedidoAtual.excluido) {
    throw new Error(
      "Este pedido foi excluído."
    );
  }

  /*
   * Impede saída duplicada
   * de estoque.
   */

  if (
    pedidoAtual.status ===
      "ENTREGUE" &&
    status === "ENTREGUE"
  ) {
    return;
  }

  const {
    error,
  } = await supabase
    .from(PEDIDOS)
    .update({
      status,
    })
    .eq(
      "id",
      id
    );

  if (error) {
    throw error;
  }

  /*
   * Apenas ENTREGUE gera
   * saída do estoque.
   */

  if (
    status !== "ENTREGUE"
  ) {
    return;
  }

  const itens =
    await getItensPedidoEstoque(
      id
    );

  for (
    const item of itens
  ) {
    /*
     * O produto pode ter sido
     * posteriormente excluído
     * do catálogo.
     */

    if (
      item.produto_id ===
        null ||
      item.produto_id ===
        undefined
    ) {
      console.warn(
        `Item "${item.nome_produto}" do pedido #${id} não possui mais produto vinculado.`
      );

      continue;
    }

    await registrarSaida({
      produto_id:
        item.produto_id,

      tipo: "SAIDA",

      quantidade:
        item.quantidade,

      motivo: "Venda",

      referencia:
        `Pedido #${id}`,

      observacao:
        item.nome_produto,
    });
  }
}

/*
 * EXCLUIR PEDIDO
 *
 * A exclusão é lógica.
 *
 * O pedido permanece no banco
 * para preservar o histórico.
 */

export async function excluirPedido(
  id: number
) {
  /*
   * Buscar pedido atual.
   */

  const {
    data: pedido,
    error: erroBusca,
  } = await supabase
    .from(PEDIDOS)
    .select(
      "id, status, excluido"
    )
    .eq(
      "id",
      id
    )
    .single();

  if (erroBusca) {
    throw erroBusca;
  }

  if (!pedido) {
    throw new Error(
      "Pedido não encontrado."
    );
  }

  /*
   * Se já estiver excluído,
   * nenhuma nova alteração
   * é necessária.
   */

  if (pedido.excluido) {
    return pedido;
  }

  /*
   * IMPORTANTE:
   *
   * Não alteramos o status
   * original durante a exclusão.
   *
   * Isso permite preservar:
   *
   * ENTREGUE -> faturamento
   *
   * enquanto o relatório pode
   * apresentar pedidos excluídos
   * não entregues como EXCLUIDO.
   */

  const {
    data,
    error,
  } = await supabase
    .from(PEDIDOS)
    .update({
      excluido: true,

      excluido_em:
        new Date().toISOString(),
    })
    .eq(
      "id",
      id
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}