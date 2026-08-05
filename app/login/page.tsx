"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
async function loginAdmin(
  usuario: string,
  senha: string
) {
  const { supabase } = await import("@/lib/supabase");

  const { data, error } = await supabase
    .from("usuarios_admin")
    .select("*")
    .eq("usuario", usuario)
    .eq("senha_hash", senha)
    .eq("ativo", true)
    .single();

  if (error) {
    return null;
  }

  return data;
}
export default function LoginPage() {

  const [usuario, setUsuario] = useState("");

  const [senha, setSenha] = useState("");
const router = useRouter();
async function entrar(
  e: React.FormEvent
) {

  e.preventDefault();

  const admin =
    await loginAdmin(
      usuario,
      senha
    );

  if (!admin) {

    alert("Usuário ou senha inválidos.");

    return;

  }

  localStorage.setItem(
    "adminLogado",
    "true"
  );

  localStorage.setItem(
    "adminNome",
    admin.nome
  );

  localStorage.setItem(
    "adminNivel",
    admin.nivel
  );

  router.push("/admin");

}
  return (

    <main className="flex min-h-screen items-center justify-center bg-[#111111] px-6">

      <div className="w-full max-w-md rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-8 shadow-2xl">

        <h1 className="mb-2 text-center text-3xl font-black tracking-[0.20em] text-[#C8A95B]">

          MTELLES

        </h1>

        <p className="mb-8 text-center text-[#F3E8D7]/60">

          Painel Administrativo

        </p>

        <form
          onSubmit={entrar}
          className="space-y-6"
        >

          <div>

            <label className="mb-2 block text-sm font-semibold">

              Usuário

            </label>

            <input
              type="text"
              value={usuario}
              onChange={(e)=>
                setUsuario(e.target.value)
              }
              className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#111111] px-4 py-3 outline-none focus:border-[#C8A95B]"
            />

          </div>

          <div>

            <label className="mb-2 block text-sm font-semibold">

              Senha

            </label>

            <input
              type="password"
              value={senha}
              onChange={(e)=>
                setSenha(e.target.value)
              }
              className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#111111] px-4 py-3 outline-none focus:border-[#C8A95B]"
            />

          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#C8A95B] py-4 font-bold text-[#111111] transition hover:scale-[1.02]"
          >

            Entrar

          </button>

        </form>

      </div>

    </main>

  );

}