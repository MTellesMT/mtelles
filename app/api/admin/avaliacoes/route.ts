import {
  NextRequest,
  NextResponse,
} from "next/server";

import { createClient } from "@supabase/supabase-js";

const TABELA_AVALIACOES =
  "avaliacoes";

/*
 * CLIENTE ADMINISTRATIVO
 *
 * Esta chave é utilizada somente
 * no servidor.
 *
 * Nunca deve possuir NEXT_PUBLIC_.
 */

function criarSupabaseAdmin() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL não configurada."
    );
  }

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY não configurada."
    );
  }

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

/*
 * GET
 *
 * BUSCAR TODAS AS AVALIAÇÕES
 * PARA O PAINEL ADMINISTRATIVO
 */

export async function GET() {
  try {
    const supabaseAdmin =
      criarSupabaseAdmin();

    const {
      data,
      error,
    } = await supabaseAdmin
      .from(TABELA_AVALIACOES)
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Erro ao buscar avaliações:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Não foi possível carregar as avaliações.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      data ?? []
    );
  } catch (error) {
    console.error(
      "Erro na API de avaliações:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erro interno ao carregar avaliações.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
 * PATCH
 *
 * ALTERAR STATUS DA AVALIAÇÃO
 *
 * Status permitidos:
 *
 * PENDENTE
 * APROVADA
 * REJEITADA
 */

export async function PATCH(
  request: NextRequest
) {
  try {
    const body =
      await request.json();

    const id =
      Number(body.id);

    const status =
      String(
        body.status ?? ""
      )
        .trim()
        .toUpperCase();

    /*
     * VALIDAR ID
     */

    if (
      !Number.isInteger(id) ||
      id <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Avaliação inválida.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * VALIDAR STATUS
     */

    const statusPermitidos = [
      "PENDENTE",
      "APROVADA",
      "REJEITADA",
    ];

    if (
      !statusPermitidos.includes(
        status
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Status inválido.",
        },
        {
          status: 400,
        }
      );
    }

    const supabaseAdmin =
      criarSupabaseAdmin();

    /*
     * ATUALIZAR AVALIAÇÃO
     */

    const {
      data,
      error,
    } = await supabaseAdmin
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
      console.error(
        "Erro ao atualizar avaliação:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Não foi possível atualizar a avaliação.",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json(
      data
    );
  } catch (error) {
    console.error(
      "Erro na API de avaliações:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Erro interno ao atualizar avaliação.",
      },
      {
        status: 500,
      }
    );
  }
}