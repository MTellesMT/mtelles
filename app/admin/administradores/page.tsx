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
        "Erro ao carregar administradores."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
  const logado =
    localStorage.getItem("adminLogado");

  const nivel =
    localStorage.getItem("adminNivel");

  if (logado !== "true") {
    window.location.href = "/login";
    return;
  }

  if (nivel !== "MASTER") {
    alert(
  "Você não possui permissão para acessar esta área."
);

setTimeout(() => {
  window.location.replace("/admin");
}, 100);

return;
  }

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
      "Deseja realmente excluir este administrador?"
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

  async function editar(
    admin: Admin
  ) {
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

    const nivel = prompt(
      "Nível (MASTER ou ADMIN):",
      admin.nivel
    );

    if (!nivel) return;

    try {
      await updateAdmin(
        admin.id,
        nome,
        usuario,
        nivel.toUpperCase()
      );

      carregarAdmins();

      alert(
        "Administrador atualizado."
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

        <h1 className="mb-8 text-4xl font-black">
          Administradores
        </h1>

        <AdminForm
          onCreated={carregarAdmins}
        />

        {loading ? (
          <div className="mt-10 rounded-3xl border border-[#C8A95B]/20 p-10 text-center">
            Carregando...
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-[#C8A95B]/20">
            <table className="w-full">

              <thead className="bg-[#181818]">

                <tr>

                  <th className="p-4 text-left">
                    Nome
                  </th>

                  <th className="p-4 text-left">
                    Usuário
                  </th>

                  <th className="p-4 text-left">
                    Nível
                  </th>

                  <th className="p-4 text-left">
                    Status
                  </th>

                  <th className="p-4 text-center">
                    Ações
                  </th>

                </tr>

              </thead>

              <tbody>
                {admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-t border-[#C8A95B]/10"
                  >
                    <td className="p-4">
                      {admin.nome}
                    </td>

                    <td className="p-4">
                      {admin.usuario}
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          admin.nivel === "MASTER"
                            ? "bg-[#C8A95B] text-[#111111]"
                            : "bg-[#222222] text-white"
                        }`}
                      >
                        {admin.nivel}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          admin.ativo
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {admin.ativo
                          ? "Ativo"
                          : "Inativo"}
                      </span>
                    </td>

                    <td className="space-x-2 p-4 text-center">

                      <button
                        onClick={() =>
                          editar(admin)
                        }
                        className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold transition hover:bg-blue-700"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() =>
                          alterarStatus(
                            admin.id,
                            admin.ativo
                          )
                        }
                        className="rounded-lg bg-yellow-500 px-3 py-2 text-sm font-semibold text-[#111111] transition hover:bg-yellow-400"
                      >
                        {admin.ativo
                          ? "Desativar"
                          : "Ativar"}
                      </button>

                      <button
                        onClick={() =>
                          excluir(admin.id)
                        }
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold transition hover:bg-red-700"
                      >
                        Excluir
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

            {admins.length === 0 && (
              <div className="p-10 text-center text-[#F3E8D7]/60">
                Nenhum administrador cadastrado.
              </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
}