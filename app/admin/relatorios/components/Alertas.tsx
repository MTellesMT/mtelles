interface AlertasProps {
  loading: boolean;
  produtosBaixoEstoque: {
    nome: string;
    estoque: number;
  }[];
}

export default function Alertas({
  loading,
  produtosBaixoEstoque,
}: AlertasProps) {
  return (
    <section className="mt-14">

      <h2 className="border-b border-[#C8A95B]/30 pb-3 text-2xl font-black text-[#C8A95B]">
        ALERTAS
      </h2>

      <div className="mt-8">

        {loading ? (

          <p>Carregando...</p>

        ) : produtosBaixoEstoque.length === 0 ? (

          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 p-5">

            <span className="font-semibold text-green-400">
              ✓ Nenhum produto com estoque baixo.
            </span>

          </div>

        ) : (

          <div className="space-y-3">

            {produtosBaixoEstoque.map((produto) => (

              <div
                key={produto.nome}
                className="flex items-center justify-between rounded-xl border border-[#2A2A2A] bg-[#181818] px-5 py-4"
              >
                <div>

                  <p className="font-semibold">
                    {produto.nome}
                  </p>

                  <p className="mt-1 text-sm text-[#F3E8D7]/60">
                    Estoque abaixo do mínimo recomendado.
                  </p>

                </div>

                <div className="rounded-full bg-red-500 px-4 py-1 text-sm font-bold text-white">
                  {produto.estoque} un.
                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </section>
  );
}