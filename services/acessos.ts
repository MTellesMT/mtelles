import { supabase } from "@/lib/supabase";

const CHAVE_ACESSO =
  "mtelles_acesso_registrado";

/*
 * REGISTRAR ACESSO
 *
 * Cada navegador/dispositivo
 * é contabilizado apenas uma vez.
 */

export async function registrarAcessoSite() {
  if (typeof window === "undefined") {
    return;
  }

  const acessoRegistrado =
    localStorage.getItem(CHAVE_ACESSO);

  if (acessoRegistrado === "true") {
    return;
  }

  const { error } = await supabase.rpc(
    "incrementar_acessos_site"
  );

  if (error) {
    throw error;
  }

  /*
   * Só marcamos como registrado
   * depois que o Supabase confirmar
   * o incremento.
   */

  localStorage.setItem(
    CHAVE_ACESSO,
    "true"
  );
}

/*
 * BUSCAR TOTAL DE ACESSOS
 *
 * Utilizado no Painel Administrativo.
 */

export async function getTotalAcessosSite() {
  const { data, error } = await supabase
    .from("acessos_site")
    .select("total")
    .eq("id", 1)
    .single();

  if (error) {
    throw error;
  }

  return Number(data?.total ?? 0);
}