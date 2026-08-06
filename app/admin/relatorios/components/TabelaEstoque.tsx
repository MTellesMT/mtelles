import { useMemo, useState } from "react";
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
  const [busca, setBusca] = useState("");

const [situacao, setSituacao] =

  useState("TODOS");
const produtosFiltrados = useMemo(() => {
  return produtos.filter((produto) => {
    const texto = busca.toLowerCase();

    const encontrou =
      produto.nome.toLowerCase().includes(texto) ||
      produto.codigo.toLowerCase().includes(texto) ||
      produto.marca.toLowerCase().includes(texto);

    if (!encontrou) {
      return false;
    }

    if (situacao === "TODOS") {
      return true;
    }

    if (
      situacao === "NORMAL" &&
      produto.estoque > 5
    ) {
      return true;
    }

    if (
      situacao === "REPOR" &&
      produto.estoque > 0 &&
      produto.estoque <= 5
    ) {
      return true;
    }

    if (
      situacao === "SEM" &&
      produto.estoque === 0
    ) {
      return true;
    }

    return false;
  });
}, [busca, situacao, produtos]);

    return (
    <section className="mt-14">

      <h2 className="border-b border-[#C8A95B]/30 pb-3 text-2xl font-black text-[#C8A95B]">
        ESTOQUE GERAL
      </h2>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#2A2A2A]">

<div className="flex flex-col gap-4 border-b border-[#2A2A2A] p-5 md:flex-row">

  <input
    type="text"
    placeholder="Pesquisar produto, código ou marca..."
    value={busca}
    onChange={(e) => setBusca(e.target.value)}
    className="flex-1 rounded-xl border border-[#2A2A2A] bg-[#111111] px-4 py-3 text-white outline-none transition focus:border-[#C8A95B]"
  />

  <select
    value={situacao}
    onChange={(e) => setSituacao(e.target.value)}
    className="w-full rounded-xl border border-[#2A2A2A] bg-[#111111] px-4 py-3 text-white outline-none transition focus:border-[#C8A95B] md:w-56"
  >
    <option value="TODOS">Todos</option>
    <option value="NORMAL">Normal</option>
    <option value="REPOR">Repor</option>
    <option value="SEM">Sem estoque</option>
  </select>

</div>

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

              produtosFiltrados.map((produto) => {

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