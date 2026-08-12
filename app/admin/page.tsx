"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import AdminForm from "@/components/admin/AdminForm";
import Link from "next/link";
import { getTotalAcessosSite } from "@/services/acessos";

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
  const [admins, setAdmins] =
    useState<Admin[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    adminEditando,
    setAdminEditando,
  ] = useState<Admin | null>(
    null
  );

  const [
    nomeEditando,
    setNomeEditando,
  ] = useState("");

  const [
    usuarioEditando,
    setUsuarioEditando,
  ] = useState("");

  const [
    senhaEditando,
    setSenhaEditando,
  ] = useState("");

  const [
    nivelEditando,
    setNivelEditando,
  ] = useState("ADMIN");

  const [
    modalEditarAberto,
    setModalEditarAberto,
  ] = useState(false);

  const [
    totalAcessos,
    setTotalAcessos,
  ] = useState(0);

  /*
   * CARREGAR ACESSOS
   */

  useEffect(() => {
    async function carregarAcessos() {
      try {
        const total =
          await getTotalAcessosSite();

        setTotalAcessos(total);
      } catch (error) {
        console.error(
          "Erro ao carregar acessos do site:",
          error
        );
      }
    }

    carregarAcessos();
  }, []);

  /*
   * CONTROLE DE ACESSO
   */

  useEffect(() => {
    const logado =
      sessionStorage.getItem(
        "adminLogado"
      );

    if (logado !== "true") {
      window.location.replace(
        "/login"
      );

      return;
    }
  }, []);

  /*
   * CARREGAR COLABORADORES
   */

  const carregarAdmins =
    useCallback(async () => {
      try {
        setLoading(true);

        const data =
          await getAdmins();

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

  /*
   * ALTERAR STATUS
   */

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

  /*
   * EXCLUIR
   */

  async function excluir(
    id: number
  ) {
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

  /*
   * EDITAR
   */

  function editar(
    admin: Admin
  ) {
    setAdminEditando(admin);

    setNomeEditando(
      admin.nome
    );

    setUsuarioEditando(
      admin.usuario
    );

    setSenhaEditando("");

    setNivelEditando(
      admin.nivel
    );

    setModalEditarAberto(
      true
    );
  }

  /*
   * SALVAR EDIÇÃO
   */

  async function salvarEdicao() {
    if (!adminEditando) {
      return;
    }

    try {
      await updateAdmin(
        adminEditando.id,
        nomeEditando,
        usuarioEditando,
        nivelEditando,
        senhaEditando
      );

      carregarAdmins();

      setModalEditarAberto(
        false
      );

      setAdminEditando(null);

      setSenhaEditando("");

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

        {/* CABEÇALHO */}

        <h1 className="mb-2 text-4xl font-black">
          Painel Administrativo
        </h1>

        <p className="mb-8 text-[#F3E8D7]/70">
          Bem-vindo ao gerenciamento
          da MTelles.
        </p>

        {/* ACESSOS AO SITE */}

        <div className="mb-8 w-full max-w-sm rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6">
          <p className="text-sm uppercase tracking-widest text-[#F3E8D7]/60">
            Acessos ao site
          </p>

          <h2 className="mt-3 text-4xl font-black text-[#C8A95B]">
            {totalAcessos.toLocaleString(
              "pt-BR"
            )}
          </h2>
        </div>

        {/* ATALHOS */}

        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-5">

          {/* PRODUTOS */}

          <Link
            href="/admin/produtos"
            className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6 transition duration-300 hover:scale-[1.02] hover:border-[#C8A95B]"
          >
            <h2 className="text-xl font-bold">
              Produtos
            </h2>

            <p className="mt-2 text-sm text-[#F3E8D7]/70">
              Cadastrar e editar
              produtos.
            </p>
          </Link>

          {/* COLABORADORES */}

          <Link
            href="/admin/administradores"
            className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6 transition duration-300 hover:scale-[1.02] hover:border-[#C8A95B]"
          >
            <h2 className="text-xl font-bold">
              Colaboradores
            </h2>

            <p className="mt-2 text-sm text-[#F3E8D7]/70">
              Gerenciar
              colaboradores.
            </p>
          </Link>

          {/* PEDIDOS */}

          <Link
            href="/admin/pedidos"
            className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6 transition duration-300 hover:scale-[1.02] hover:border-[#C8A95B]"
          >
            <h2 className="text-xl font-bold">
              Pedidos
            </h2>

            <p className="mt-2 text-sm text-[#F3E8D7]/70">
              Gerenciar pedidos.
            </p>
          </Link>

          {/* RELATÓRIOS */}

          <Link
            href="/admin/relatorios"
            className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6 transition duration-300 hover:scale-[1.02] hover:border-[#C8A95B] hover:shadow-lg hover:shadow-[#C8A95B]/10"
          >
            <h2 className="text-xl font-bold">
              Relatórios
            </h2>

            <p className="mt-2 text-sm text-[#F3E8D7]/70">
              Visualizar estatísticas
              e indicadores.
            </p>
          </Link>

          {/* AVALIAÇÕES */}

          <Link
            href="/admin/avaliacoes"
            className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-6 transition duration-300 hover:scale-[1.02] hover:border-[#C8A95B] hover:shadow-lg hover:shadow-[#C8A95B]/10"
          >
            <h2 className="text-xl font-bold">
              Avaliações
            </h2>

            <p className="mt-2 text-sm text-[#F3E8D7]/70">
              Gerenciar avaliações
              de clientes.
            </p>
          </Link>
        </div>

        {/* ÁREA ADMINISTRATIVA */}

        <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-8 text-center">
          <h2 className="text-2xl font-bold">
            Área Administrativa
          </h2>

          <p className="mt-4 text-[#F3E8D7]/70">
            Utilize os atalhos acima
            para acessar cada módulo
            do sistema.
          </p>
        </div>

        <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-8 text-center">
          <h2 className="text-2xl font-bold">
            Área Administrativa
          </h2>

          <p className="mt-4 text-[#F3E8D7]/70">
            Utilize os atalhos acima
            para acessar cada módulo
            do sistema.
          </p>
        </div>
      </div>

      {/* MODAL EDITAR COLABORADOR */}

      {modalEditarAberto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-lg rounded-3xl border border-[#C8A95B]/30 bg-[#181818] p-8">
            <h2 className="mb-6 text-2xl font-bold text-[#C8A95B]">
              Editar Colaborador
            </h2>

            <div className="space-y-5">

              {/* NOME */}

              <div>
                <label className="mb-2 block text-sm">
                  Nome
                </label>

                <input
                  value={
                    nomeEditando
                  }
                  onChange={(
                    event
                  ) =>
                    setNomeEditando(
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-xl bg-[#111111] p-3 outline-none"
                />
              </div>

              {/* USUÁRIO */}

              <div>
                <label className="mb-2 block text-sm">
                  Usuário
                </label>

                <input
                  value={
                    usuarioEditando
                  }
                  onChange={(
                    event
                  ) =>
                    setUsuarioEditando(
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-xl bg-[#111111] p-3 outline-none"
                />
              </div>

              {/* SENHA */}

              <div>
                <label className="mb-2 block text-sm">
                  Nova senha
                </label>

                <input
                  type="password"
                  value={
                    senhaEditando
                  }
                  onChange={(
                    event
                  ) =>
                    setSenhaEditando(
                      event.target
                        .value
                    )
                  }
                  placeholder="Deixe em branco para manter"
                  className="w-full rounded-xl bg-[#111111] p-3 outline-none"
                />
              </div>

              {/* CARGO */}

              <div>
                <label className="mb-2 block text-sm">
                  Cargo
                </label>

                <select
                  value={
                    nivelEditando
                  }
                  onChange={(
                    event
                  ) =>
                    setNivelEditando(
                      event.target
                        .value
                    )
                  }
                  className="w-full rounded-xl bg-[#111111] p-3"
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

            {/* BOTÕES */}

            <div className="mt-8 flex justify-end gap-4">
              <button
                type="button"
                onClick={() =>
                  setModalEditarAberto(
                    false
                  )
                }
                className="rounded-xl bg-gray-700 px-5 py-3"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={
                  salvarEdicao
                }
                className="rounded-xl bg-[#C8A95B] px-5 py-3 font-bold text-black"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}