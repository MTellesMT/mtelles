"use client";

import { useCallback, useEffect, useState } from "react";
import {
  alterarStatusAdmin,
  deleteAdmin,
  getAdmins,
} from "@/services/admins";

export default function AdministradoresPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarAdmins = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getAdmins();

      setAdmins(data);
    } catch (error) {
      console.error(error);

      alert("Erro ao carregar administradores.");
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
    await alterarStatusAdmin(id, !ativo);

    carregarAdmins();
  }

  async function excluir(id: number) {
    if (
      !confirm(
        "Deseja realmente excluir este administrador?"
      )
    ) {
      return;
    }

    await deleteAdmin(id);

    carregarAdmins();
  }

  return (
    <main className="min-h-screen bg-[#111111] p-8 text-white">

      <div className="mx-auto max-w-7xl">

        <h1 className="mb-8 text-4xl font-black">
          Administradores
        </h1>

        {loading ? (

          <p>Carregando...</p>

        ) : (

          <div className="overflow-hidden rounded-3xl border border-[#C8A95B]/20">

            <table className="w-full">

              <thead className="bg-[#1a1a1a]">

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
                      {admin.nivel}
                    </td>

                    <td className="p-4">
                      {admin.ativo
                        ? "Ativo"
                        : "Inativo"}
                    </td>

                    <td className="space-x-2 p-4 text-center">

                      <button
                        onClick={() =>
                          alterarStatus(
                            admin.id,
                            admin.ativo
                          )
                        }
                        className="rounded-lg bg-yellow-600 px-3 py-2"
                      >
                        {admin.ativo
                          ? "Desativar"
                          : "Ativar"}
                      </button>

                      <button
                        onClick={() =>
                          excluir(admin.id)
                        }
                        className="rounded-lg bg-red-600 px-3 py-2"
                      >
                        Excluir
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </main>
  );
}