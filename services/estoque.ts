import { supabase } from "@/lib/supabase";

const PRODUTOS = "produtos";
const MOVIMENTACOES = "movimentacoes";

interface MovimentacaoEstoque {
  produto_id: number;
  tipo: "ENTRADA" | "SAIDA" | "AJUSTE";
  quantidade: number;
  motivo: string;
  referencia?: string;
  observacao?: string;
}

async function buscarProduto(
  produtoId: number
) {
  const { data, error } =
    await supabase
      .from(PRODUTOS)
      .select("id,nome,estoque")
      .eq("id", produtoId)
      .single();

  if (error) throw error;

  return data;
}

async function registrarMovimentacao(
  produto: {
    id: number;
    nome: string;
  },
  movimentacao: MovimentacaoEstoque,
  estoqueAnterior: number,
  estoqueAtual: number
) {
  const { error } =
    await supabase
      .from(MOVIMENTACOES)
      .insert({
        produto: produto.nome,
        produto_id: produto.id,
        tipo: movimentacao.tipo,
        quantidade: movimentacao.quantidade,
        estoque_anterior:
          estoqueAnterior,
        estoque_atual:
          estoqueAtual,
        motivo: movimentacao.motivo,
        referencia:
          movimentacao.referencia ??
          null,
        observacao:
          movimentacao.observacao ??
          null,
      });

  if (error) throw error;
}

export async function getMovimentacoes() {
  const { data, error } =
    await supabase
      .from(MOVIMENTACOES)
      .select("*")
      .order("created_at", {
        ascending: false,
      });

  if (error) throw error;

  return data ?? [];
}

export async function registrarEntrada(
  movimentacao: MovimentacaoEstoque
) {
  const produto =
    await buscarProduto(
      movimentacao.produto_id
    );

  const estoqueAnterior =
    Number(produto.estoque);

  const estoqueAtual =
    estoqueAnterior +
    movimentacao.quantidade;

  const {
    error: erroAtualizar,
  } = await supabase
    .from(PRODUTOS)
    .update({
      estoque: estoqueAtual,
    })
    .eq("id", produto.id);

  if (erroAtualizar)
    throw erroAtualizar;

  await registrarMovimentacao(
    produto,
    movimentacao,
    estoqueAnterior,
    estoqueAtual
  );
}
export async function registrarSaida(
  movimentacao: MovimentacaoEstoque
) {
  const produto =
    await buscarProduto(
      movimentacao.produto_id
    );

  const estoqueAnterior =
    Number(produto.estoque);

  if (
    estoqueAnterior <
    movimentacao.quantidade
  ) {
    throw new Error(
      "Estoque insuficiente."
    );
  }

  const estoqueAtual =
    estoqueAnterior -
    movimentacao.quantidade;

  const {
    error: erroAtualizar,
  } = await supabase
    .from(PRODUTOS)
    .update({
      estoque: estoqueAtual,
    })
    .eq("id", produto.id);

  if (erroAtualizar)
    throw erroAtualizar;

  await registrarMovimentacao(
    produto,
    movimentacao,
    estoqueAnterior,
    estoqueAtual
  );
}

export async function registrarAjuste(
  movimentacao: MovimentacaoEstoque
) {
  const produto =
    await buscarProduto(
      movimentacao.produto_id
    );

  const estoqueAnterior =
    Number(produto.estoque);

  const estoqueAtual =
    movimentacao.quantidade;

  const {
    error: erroAtualizar,
  } = await supabase
    .from(PRODUTOS)
    .update({
      estoque: estoqueAtual,
    })
    .eq("id", produto.id);

  if (erroAtualizar)
    throw erroAtualizar;

  await registrarMovimentacao(
    produto,
    movimentacao,
    estoqueAnterior,
    estoqueAtual
  );
}