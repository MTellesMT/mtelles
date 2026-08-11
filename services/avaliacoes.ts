import { supabase } from "@/lib/supabase";

const TABELA_AVALIACOES =
  "avaliacoes";

const BUCKET_AVALIACOES =
  "avaliacoes";

export interface Avaliacao {
  id: number;
  nome_cliente: string;
  nota: number;
  comentario: string;
  fotos: string[];
  status: string;
  created_at: string;
}

export interface NovaAvaliacao {
  nome_cliente: string;
  nota: number;
  comentario: string;
  fotos: File[];
}

/*
 * BUSCAR AVALIAÇÕES APROVADAS
 *
 * Utilizado na Home.
 * Apenas avaliações aprovadas
 * podem aparecer publicamente.
 */

export async function getAvaliacoesAprovadas() {
  const {
    data,
    error,
  } = await supabase
    .from(TABELA_AVALIACOES)
    .select("*")
    .eq(
      "status",
      "APROVADA"
    )
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (
    data as Avaliacao[]
  ) ?? [];
}

/*
 * BUSCAR TODAS AS AVALIAÇÕES
 *
 * Utilizado pelo painel
 * administrativo.
 */

export async function getAvaliacoes() {
  const {
    data,
    error,
  } = await supabase
    .from(TABELA_AVALIACOES)
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (
    data as Avaliacao[]
  ) ?? [];
}

/*
 * ATUALIZAR STATUS
 *
 * Utilizado pelo painel para
 * aprovar ou rejeitar uma
 * avaliação.
 */

export async function atualizarStatusAvaliacao(
  id: number,
  status:
    | "APROVADA"
    | "REJEITADA"
) {
  const {
    data,
    error,
  } = await supabase
    .from(TABELA_AVALIACOES)
    .update({
      status,
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

/*
 * UPLOAD DAS FOTOS
 */

async function uploadFotos(
  arquivos: File[]
) {
  const urls: string[] = [];

  /*
   * Máximo de 3 fotos.
   */

  const fotos =
    arquivos.slice(0, 3);

  for (const foto of fotos) {
    /*
     * Limite de 5 MB por foto.
     */

    if (
      foto.size >
      5 * 1024 * 1024
    ) {
      throw new Error(
        "Cada foto pode ter no máximo 5 MB."
      );
    }

    /*
     * Tipos permitidos.
     */

    const tiposPermitidos = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !tiposPermitidos.includes(
        foto.type
      )
    ) {
      throw new Error(
        "Formato de imagem não permitido."
      );
    }

    /*
     * Sanitizar nome do arquivo.
     */

    const nomeSeguro =
      foto.name
        .normalize("NFD")
        .replace(
          /[\u0300-\u036f]/g,
          ""
        )
        .replace(
          /[^a-zA-Z0-9._-]/g,
          "-"
        );

    const caminho =
      `${Date.now()}-${Math.random()
        .toString(36)
        .substring(
          2,
          10
        )}-${nomeSeguro}`;

    /*
     * ENVIAR PARA STORAGE
     */

    const {
      error: erroUpload,
    } = await supabase.storage
      .from(
        BUCKET_AVALIACOES
      )
      .upload(
        caminho,
        foto,
        {
          cacheControl:
            "3600",
          upsert: false,
        }
      );

    if (erroUpload) {
      throw erroUpload;
    }

    /*
     * PEGAR URL PÚBLICA
     */

    const {
      data: urlData,
    } = supabase.storage
      .from(
        BUCKET_AVALIACOES
      )
      .getPublicUrl(
        caminho
      );

    urls.push(
      urlData.publicUrl
    );
  }

  return urls;
}

/*
 * ENVIAR NOVA AVALIAÇÃO
 */

export async function enviarAvaliacao(
  avaliacao: NovaAvaliacao
) {
  const nome =
    avaliacao.nome_cliente.trim();

  const comentario =
    avaliacao.comentario.trim();

  /*
   * VALIDAÇÕES
   */

  if (!nome) {
    throw new Error(
      "Informe seu nome."
    );
  }

  if (
    avaliacao.nota < 1 ||
    avaliacao.nota > 5
  ) {
    throw new Error(
      "Selecione uma nota de 1 a 5 estrelas."
    );
  }

  if (!comentario) {
    throw new Error(
      "Conte como foi sua experiência."
    );
  }

  if (
    avaliacao.fotos.length >
    3
  ) {
    throw new Error(
      "Você pode enviar no máximo 3 fotos."
    );
  }

  /*
   * UPLOAD DAS FOTOS
   */

  const fotos =
    avaliacao.fotos.length >
    0
      ? await uploadFotos(
          avaliacao.fotos
        )
      : [];

  /*
   * SALVAR AVALIAÇÃO
   *
   * A avaliação entra sempre
   * como PENDENTE.
   *
   * Não utilizamos
   * .select().single()
   * depois do INSERT porque
   * avaliações pendentes não
   * devem ser lidas
   * publicamente.
   */

  const {
    error,
  } = await supabase
    .from(
      TABELA_AVALIACOES
    )
    .insert({
      nome_cliente: nome,
      nota: avaliacao.nota,
      comentario,
      fotos,
      status: "PENDENTE",
    });

  if (error) {
    console.error(
      "Erro ao enviar avaliação:",
      error
    );

    throw error;
  }

  return true;
}