interface ResumoEstoqueProps {
  loading: boolean;
  estoqueTotal: number;
  produtosBaixoEstoque: {
    nome: string;
    estoque: number;
  }[];
}

export default function ResumoEstoque({
  loading,
  estoqueTotal,
  produtosBaixoEstoque,
}: ResumoEstoqueProps) {
  return (
    <section className="mt-14">

      <h2 className="border-b border-[#C8A95B]/30 pb-3 text-2xl font-black text-[#C8A95B]">
        RESUMO DE ESTOQUE
      </h2>

      <div className="mt-8 space-y-5">

        <div className="flex justify-between border-b border-[#2A2A2A] pb-3">
          <span>Itens disponíveis</span>

          <strong className="text-blue-400">
            {loading ? "--" : estoqueTotal}
          </strong>
        </div>

        <div className="flex justify-between border-b border-[#2A2A2A] pb-3">
          <span>Produtos com estoque baixo</span>

          <strong className="text-orange-400">
            {loading ? "--" : produtosBaixoEstoque.length}
          </strong>
        </div>

      </div>

    </section>
  );
}