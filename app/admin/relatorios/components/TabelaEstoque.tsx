interface ProdutoEstoque {
  id: number;
  nome: string;
  codigo: string;
  marca: string;
  estoque: number;
}

interface TabelaEstoqueProps {
  loading: boolean;
  produtos: ProdutoEstoque[];
}

export default function TabelaEstoque({
  loading,
  produtos,
}: TabelaEstoqueProps) {
  return (
    <section className="mt-14">

      <h2 className="border-b border-[#C8A95B]/30 pb-3 text-2xl font-black text-[#C8A95B]">
        ESTOQUE GERAL
      </h2>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#2A2A2A]">

        <table className="w-full">

          <thead className="bg-[#181818]">

            <tr>

              <th className="p-4 text-left">
                Produto
              </th>

              <th className="p-4 text-left">
                Código
              </th>

              <th className="p-4 text-left">
                Marca
              </th>

              <th className="p-4 text-center">
                Estoque
              </th>

              <th className="p-4 text-center">
                Situação
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>

                <td
                  colSpan={5}
                  className="p-8 text-center"
                >
                  Carregando...
                </td>

              </tr>

            ) : produtos.length === 0 ? (

              <tr>

                <td
                  colSpan={5}
                  className="p-8 text-center text-[#F3E8D7]/60"
                >
                  Nenhum produto encontrado.
                </td>

              </tr>

            ) : (

              produtos.map((produto) => {

                let situacao =
                  "Normal";

                let cor =
                  "text-green-400";

                if (
                  produto.estoque <= 5 &&
                  produto.estoque > 0
                ) {
                  situacao =
                    "Repor";

                  cor =
                    "text-orange-400";
                }

                if (
                  produto.estoque === 0
                ) {
                  situacao =
                    "Sem estoque";

                  cor =
                    "text-red-400";
                }

                return (

                  <tr
                    key={produto.id}
                    className="border-t border-[#2A2A2A]"
                  >

                    <td className="p-4">
                      {produto.nome}
                    </td>

                    <td className="p-4">
                      {produto.codigo}
                    </td>

                    <td className="p-4">
                      {produto.marca}
                    </td>

                    <td className="p-4 text-center font-bold">
                      {produto.estoque}
                    </td>

                    <td
                      className={`p-4 text-center font-bold ${cor}`}
                    >
                      {situacao}
                    </td>

                  </tr>

                );

              })

            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}