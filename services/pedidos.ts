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

  console.log("ERRO PEDIDO:", error);
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
      pedido_id: pedidoCriado.id,
    })
  );

  console.log("ITENS:", itensPedido);

  const { error: erroItens } =
    await supabase
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

export async function getPedidos() {
  const { data, error } =
    await supabase
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

export async function getItensPedido(
  pedidoId: number
) {
  const { data, error } =
    await supabase
      .from(ITENS)
      .select(`
        *,
        produtos (
          imagem_principal
        )
      `)
      .eq("pedido_id", pedidoId);

  if (error) {
    throw error;
  }

  return (
    data?.map((item: any) => ({
      ...item,
      imagem_principal:
        item.produtos
          ?.imagem_principal ?? "",
    })) ?? []
  );
}

export async function getItensPedidoEstoque(
  pedidoId: number
) {
  const { data, error } =
    await supabase
      .from(ITENS)
      .select(`
        produto_id,
        nome_produto,
        quantidade
      `)
      .eq("pedido_id", pedidoId);

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function atualizarStatusPedido(
  id: number,
  status: string
) {
  const {
    data: pedidoAtual,
    error: erroPedido,
  } = await supabase
    .from(PEDIDOS)
    .select("status")
    .eq("id", id)
    .single();

  if (erroPedido) {
    throw erroPedido;
  }

  if (
    pedidoAtual.status ===
      "ENTREGUE" &&
    status === "ENTREGUE"
  ) {
    return;
  }

  const { error } = await supabase
    .from(PEDIDOS)
    .update({
      status,
    })
    .eq("id", id);

  if (error) {
    throw error;
  }

  if (status !== "ENTREGUE") {
    return;
  }

  const itens =
    await getItensPedidoEstoque(id);

  for (const item of itens) {
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