"use client";

interface AcessoRestritoPageProps {
  onOk: () => void;
}

export default function AcessoRestritoPage({
  onOk,
}: AcessoRestritoPageProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111111] px-6">

      <div className="w-full max-w-lg rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-10 text-center shadow-2xl">

        <div className="mb-6 text-7xl">
          🔒
        </div>

        <h1 className="text-3xl font-black text-[#C8A95B]">
          ACESSO RESTRITO
        </h1>

        <p className="mt-6 text-lg text-[#F3E8D7]">
          Você não possui permissão para acessar este módulo.
        </p>

        <p className="mt-4 text-[#F3E8D7]/70">
          Este recurso é exclusivo da
          <br />
          <strong>Gerência (MASTER)</strong>.
        </p>

        <p className="mt-6 text-sm text-[#C8A95B]">
          Você será redirecionado ao painel principal.
        </p>

        <button
          onClick={onOk}
          className="mt-8 w-full rounded-xl bg-[#C8A95B] py-4 font-bold text-[#111111] transition hover:brightness-110"
        >
          OK
        </button>

      </div>

    </main>
  );
}