"use client";

import { useCallback, useEffect, useState } from "react";
import AdminForm from "@/components/admin/AdminForm";

import {
  alterarStatusAdmin,
  deleteAdmin,
  getAdmins,
  updateAdmin,
} from "@/services/admins";

import AcessoNegadoModal from "@/components/admin/AcessoNegadoModal";
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

const [adminEditando, setAdminEditando] =
  useState<Admin | null>(null);

const [modalEditarAberto, setModalEditarAberto] =
  useState(false);

const [nomeEditando, setNomeEditando] =
  useState("");

const [usuarioEditando, setUsuarioEditando] =
  useState("");

const [senhaEditando, setSenhaEditando] =
  useState("");

const [nivelEditando, setNivelEditando] =
  useState("ADMIN");
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
  
const [mostrarAcessoNegado, setMostrarAcessoNegado] =
  useState(false);

  useEffect(() => {
  const logado =
  sessionStorage.getItem("adminLogado");

  const nivel =
  sessionStorage.getItem("adminNivel");

  if (logado !== "true") {
    window.location.href = "/login";
    return;
  }

  if (nivel !== "MASTER") {
  setMostrarAcessoNegado(true);

  setTimeout(() => {
    window.location.replace("/admin");
  }, 3000);

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

  function editar(admin: Admin) {
  setAdminEditando(admin);

  setNomeEditando(admin.nome);

  setUsuarioEditando(admin.usuario);

  setSenhaEditando("");

  setNivelEditando(admin.nivel);

  setModalEditarAberto(true);
}
async function salvarEdicao() {
  if (!adminEditando) return;

  try {
    await updateAdmin(
      adminEditando.id,
      nomeEditando,
      usuarioEditando,
      nivelEditando,
      senhaEditando
    );

    setModalEditarAberto(false);

    setAdminEditando(null);

    carregarAdmins();

    alert("Colaborador atualizado.");
  } catch (error) {
    console.error(error);

    alert("Erro ao atualizar.");
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
      {modalEditarAberto && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

    <div className="w-full max-w-xl rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-8 shadow-2xl">

      <h2 className="mb-6 text-2xl font-black text-[#C8A95B]">
        Editar Colaborador
      </h2>

      <div className="space-y-5">

        <div>
          <label className="mb-2 block text-sm">
            Nome
          </label>

          <input
            value={nomeEditando}
            onChange={(e) =>
              setNomeEditando(e.target.value)
            }
            className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111] p-3 outline-none focus:border-[#C8A95B]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm">
            Usuário
          </label>

          <input
            value={usuarioEditando}
            onChange={(e) =>
              setUsuarioEditando(e.target.value)
            }
            className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111] p-3 outline-none focus:border-[#C8A95B]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm">
            Nova senha
          </label>

          <input
            type="password"
            value={senhaEditando}
            onChange={(e) =>
              setSenhaEditando(e.target.value)
            }
            placeholder="Deixe em branco para manter a atual"
            className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111] p-3 outline-none focus:border-[#C8A95B]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm">
            Cargo
          </label>

          <select
            value={nivelEditando}
            onChange={(e) =>
              setNivelEditando(e.target.value)
            }
            className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111] p-3 outline-none focus:border-[#C8A95B]"
          >
            <option value="MASTER">
              Gerência
            </option>

            <option value="ADMIN">
              Funcionário
            </option>

          </select>

        </div>

      </div>

      <div className="mt-8 flex justify-end gap-4">

        <button
          onClick={() =>
            setModalEditarAberto(false)
          }
          className="rounded-xl bg-[#333333] px-6 py-3 font-semibold transition hover:bg-[#444444]"
        >
          Cancelar
        </button>

        <button
          onClick={salvarEdicao}
          className="rounded-xl bg-[#C8A95B] px-6 py-3 font-bold text-[#111111] transition hover:brightness-110"
        >
          Salvar
        </button>

      </div>

    </div>

  </div>
)}
<AcessoNegadoModal
  aberto={mostrarAcessoNegado}
  onOk={() => {
    window.location.replace("/admin");
  }}
/>
    </main>
  );
}