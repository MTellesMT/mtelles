import { supabase } from "@/lib/supabase";

const PRODUTOS = "produtos";
const MOVIMENTACOES = "movimentacao_estoque";

interface MovimentacaoEstoque {
  produto_id: number;
  tipo: "ENTRADA" | "SAIDA" | "AJUSTE";
  quantidade: number;
  motivo: string;
  referencia?: string;
  observacao?: string;
}

export async function getMovimentacoes() {
  const { data, error } = await supabase
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
  const { data: produto, error } = await supabase
    .from(PRODUTOS)
    .select("estoque")
    .eq("id", movimentacao.produto_id)
    .single();

  if (error) throw error;

  const estoqueAnterior = Number(produto.estoque);

  const estoqueAtual =
    estoqueAnterior + movimentacao.quantidade;

  const { error: erroAtualizar } = await supabase
    .from(PRODUTOS)
    .update({
      estoque: estoqueAtual,
    })
    .eq("id", movimentacao.produto_id);

  if (erroAtualizar) throw erroAtualizar;

  const { error: erroMovimentacao } =
    await supabase
      .from(MOVIMENTACOES)
      .insert({
        produto_id: movimentacao.produto_id,
        tipo: "ENTRADA",
        quantidade: movimentacao.quantidade,
        estoque_anterior: estoqueAnterior,
        estoque_atual: estoqueAtual,
        motivo: movimentacao.motivo,
        referencia:
          movimentacao.referencia ?? null,
        observacao:
          movimentacao.observacao ?? null,
      });

  if (erroMovimentacao) throw erroMovimentacao;
}

export async function registrarSaida(
  movimentacao: MovimentacaoEstoque
) {
  const { data: produto, error } = await supabase
    .from(PRODUTOS)
    .select("estoque")
    .eq("id", movimentacao.produto_id)
    .single();

  if (error) throw error;

  const estoqueAnterior = Number(produto.estoque);

  if (
    estoqueAnterior < movimentacao.quantidade
  ) {
    throw new Error(
      "Estoque insuficiente."
    );
  }

  const estoqueAtual =
    estoqueAnterior - movimentacao.quantidade;

  const { error: erroAtualizar } = await supabase
    .from(PRODUTOS)
    .update({
      estoque: estoqueAtual,
    })
    .eq("id", movimentacao.produto_id);

  if (erroAtualizar) throw erroAtualizar;

  const { error: erroMovimentacao } =
    await supabase
      .from(MOVIMENTACOES)
      .insert({
        produto_id: movimentacao.produto_id,
        tipo: "SAIDA",
        quantidade: movimentacao.quantidade,
        estoque_anterior: estoqueAnterior,
        estoque_atual: estoqueAtual,
        motivo: movimentacao.motivo,
        referencia:
          movimentacao.referencia ?? null,
        observacao:
          movimentacao.observacao ?? null,
      });

  if (erroMovimentacao) throw erroMovimentacao;
}

export async function registrarAjuste(
  movimentacao: MovimentacaoEstoque
) {
  const { data: produto, error } = await supabase
    .from(PRODUTOS)
    .select("estoque")
    .eq("id", movimentacao.produto_id)
    .single();

  if (error) throw error;

  const estoqueAnterior = Number(produto.estoque);

  const estoqueAtual =
    movimentacao.quantidade;

  const { error: erroAtualizar } = await supabase
    .from(PRODUTOS)
    .update({
      estoque: estoqueAtual,
    })
    .eq("id", movimentacao.produto_id);

  if (erroAtualizar) throw erroAtualizar;

  const { error: erroMovimentacao } =
    await supabase
      .from(MOVIMENTACOES)
      .insert({
        produto_id: movimentacao.produto_id,
        tipo: "AJUSTE",
        quantidade: movimentacao.quantidade,
        estoque_anterior: estoqueAnterior,
        estoque_atual: estoqueAtual,
        motivo: movimentacao.motivo,
        referencia:
          movimentacao.referencia ?? null,
        observacao:
          movimentacao.observacao ?? null,
      });

  if (erroMovimentacao) throw erroMovimentacao;
}