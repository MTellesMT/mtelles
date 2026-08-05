"use client";

import { useCallback, useEffect, useState } from "react";
import AdminForm from "@/components/admin/AdminForm";

import {
  alterarStatusAdmin,
  deleteAdmin,
  getAdmins,
  updateAdmin,
} from "@/services/admins";

interface Admin {
  id: number;
  nome: string;
  usuario: string;
  nivel: string;
  ativo: boolean;
}

export default function AdministradoresPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarAdmins = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getAdmins();

      setAdmins(data ?? []);
    } catch (error) {
      console.error(error);

      alert(
        "Erro ao carregar colaboradores."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarAdmins();
  }, [carregarAdmins]);

  async function alterarStatus(
    id: number,
    ativo: boolean
  ) {
    try {
      await alterarStatusAdmin(
        id,
        !ativo
      );

      carregarAdmins();
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível alterar o status."
      );
    }
  }

  async function excluir(id: number) {
    const confirmar = confirm(
      "Deseja realmente excluir este colaborador?"
    );

    if (!confirmar) {
      return;
    }

    try {
      await deleteAdmin(id);

      carregarAdmins();
    } catch (error) {
      console.error(error);

      alert(
        "Não foi possível excluir."
      );
    }
  }

  async function editar(admin: Admin) {
    const nome = prompt(
      "Nome:",
      admin.nome
    );

    if (!nome) return;

    const usuario = prompt(
      "Usuário:",
      admin.usuario
    );

    if (!usuario) return;

    const cargoAtual =
      admin.nivel === "MASTER"
        ? "Gerência"
        : "Funcionário";

    const cargo = prompt(
      "Cargo (Gerência ou Funcionário):",
      cargoAtual
    );

    if (!cargo) return;

    const nivel =
      cargo.toLowerCase() === "gerência" ||
      cargo.toLowerCase() === "gerencia"
        ? "MASTER"
        : "ADMIN";

    try {
      await updateAdmin(
        admin.id,
        nome,
        usuario,
        nivel
      );

      carregarAdmins();

      alert(
        "Colaborador atualizado."
      );
    } catch (error) {
      console.error(error);

      alert(
        "Erro ao atualizar."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#111111] p-8 text-white">
      <div className="mx-auto max-w-7xl">

        <h1 className="mb-2 text-4xl font-black">
  Painel Administrativo
</h1>

<p className="mb-8 text-[#F3E8D7]/70">
  Bem-vindo ao gerenciamento da MTelles.
</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">

  <a
    href="/admin/produto"
    className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6 transition hover:border-[#C8A95B]"
  >
    <h2 className="text-xl font-bold">
      Produtos
    </h2>

    <p className="mt-2 text-sm text-[#F3E8D7]/70">
      Cadastrar e editar produtos.
    </p>
  </a>

  <a
    href="/admin/administradores"
    className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6 transition hover:border-[#C8A95B]"
  >
    <h2 className="text-xl font-bold">
      Colaboradores
    </h2>

    <p className="mt-2 text-sm text-[#F3E8D7]/70">
      Gerenciar colaboradores.
    </p>
  </a>

  <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6 opacity-60">
    <h2 className="text-xl font-bold">
      Pedidos
    </h2>

    <p className="mt-2 text-sm">
      Em breve
    </p>
  </div>

  <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6 opacity-60">
    <h2 className="text-xl font-bold">
      Relatórios
    </h2>

    <p className="mt-2 text-sm">
      Em breve
    </p>
  </div>

</div>

<div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-8 text-center">

  <h2 className="text-2xl font-bold">
    Área Administrativa
  </h2>

  <p className="mt-4 text-[#F3E8D7]/70">
    Utilize os atalhos acima para acessar cada módulo do sistema.
  </p>

</div>
<div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-8 text-center">

  <h2 className="text-2xl font-bold">
    Área Administrativa
  </h2>

  <p className="mt-4 text-[#F3E8D7]/70">
    Utilize os atalhos acima para acessar cada módulo do sistema.
  </p>

</div>
      </div>
    </main>
  );
}