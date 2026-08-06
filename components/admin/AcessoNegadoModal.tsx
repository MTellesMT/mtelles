"use client";

interface AcessoNegadoModalProps {
  aberto: boolean;
  onOk: () => void;
}

export default function AcessoNegadoModal({
  aberto,
  onOk,
}: AcessoNegadoModalProps) {
  if (!aberto) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70">

      <div className="w-full max-w-md rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-8 shadow-2xl">

        <div className="mb-6 flex justify-center text-6xl">
          🔒
        </div>

        <h2 className="text-center text-2xl font-black text-[#C8A95B]">
          Acesso Restrito
        </h2>

        <p className="mt-6 text-center text-[#F3E8D7]/80">
          Você não possui permissão para acessar este módulo.
        </p>

        <p className="mt-3 text-center text-sm text-[#F3E8D7]/60">
          Este recurso é exclusivo da
          <br />
          <strong>Gerência (MASTER)</strong>.
        </p>

        <p className="mt-5 text-center text-xs text-[#C8A95B]">
          Você será redirecionado ao painel principal.
        </p>

        <button
          onClick={onOk}
          className="mt-8 w-full rounded-xl bg-[#C8A95B] py-3 font-bold text-[#111111] transition hover:brightness-110"
        >
          OK
        </button>

      </div>

    </div>
  );
}