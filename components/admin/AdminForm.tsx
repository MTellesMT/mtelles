"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminForm({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [nome, setNome] = useState("");
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [nivel, setNivel] = useState("ADMIN");

  async function salvar(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase
      .from("usuarios_admin")
      .insert({
        nome,
        usuario,
        senha_hash: senha,
        nivel,
        ativo: true,
      });

    if (error) {
      alert(error.message);
      return;
    }

    setNome("");
    setUsuario("");
    setSenha("");
    setNivel("ADMIN");

    onCreated();

    alert("Colaborador cadastrado com sucesso.");
  }

  return (
    <form
      onSubmit={salvar}
      className="mb-8 rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6"
    >
      <h2 className="mb-6 text-2xl font-bold">
        Novo Colaborador
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block">
            Nome
          </label>

          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#111111] p-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block">
            Usuário
          </label>

          <input
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#111111] p-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block">
            Senha
          </label>

          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#111111] p-3"
            required
          />
        </div>

        <div>
          <label className="mb-2 block">
            Cargo
          </label>

          <select
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
            className="w-full rounded-xl border border-[#C8A95B]/20 bg-[#111111] p-3"
          >
            <option value="ADMIN">
              Funcionário
            </option>

            <option value="MASTER">
              Gerência
            </option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        className="mt-8 rounded-xl bg-[#C8A95B] px-8 py-3 font-bold text-[#111111]"
      >
        Salvar Colaborador
      </button>
    </form>
  );
}