"use client";

import { Product } from "@/types/product";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: number) => void;
  onEdit: (product: Product) => void;
}

export default function ProductTable({
  products,
  onDelete,
  onEdit,
}: ProductTableProps) {
  return (
    <div className="mt-12 overflow-hidden rounded-3xl border border-[#C8A95B]/20">

      <table className="w-full">

        <thead className="bg-[#1a1a1a]">

          <tr className="text-left">

            <th className="px-6 py-5">
              Foto
            </th>

            <th className="px-6 py-5">
              Produto
            </th>

            <th className="px-6 py-5">
              Categoria
            </th>

            <th className="px-6 py-5">
              Preço
            </th>

            <th className="px-6 py-5">
              Estoque
            </th>

            <th className="px-6 py-5 text-center">
              Status
            </th>

            <th className="px-6 py-5 text-center">
              Ações
            </th>

          </tr>

        </thead>

        <tbody>

          {products.length === 0 && (

            <tr>

              <td
                colSpan={7}
                className="py-10 text-center text-[#F3E8D7]/60"
              >
                Nenhum produto cadastrado.
              </td>

            </tr>

          )}

          {products.map((product) => (

            <tr
              key={product.id}
              className="border-t border-[#C8A95B]/10 hover:bg-[#1b1b1b]"
            >

              <td className="px-6 py-5">

                {product.imagem_principal ? (

                  <img
                    src={product.imagem_principal}
                    alt={product.nome}
                    className="h-16 w-16 rounded-xl object-cover"
                  />

                ) : (

                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#222] text-xs">
                    Sem foto
                  </div>

                )}

              </td>

              <td className="px-6 py-5">

                <p className="font-semibold">
                  {product.nome}
                </p>

                <p className="text-sm text-[#F3E8D7]/50">
                  {product.marca}
                </p>

              </td>

              <td className="px-6 py-5">
                {product.categoria}
              </td>

              <td className="px-6 py-5 font-semibold text-[#C8A95B]">

                {Number(product.preco).toLocaleString(
                  "pt-BR",
                  {
                    style: "currency",
                    currency: "BRL",
                  }
                )}

              </td>

              <td className="px-6 py-5">
                {product.estoque}
              </td>              <td className="px-6 py-5 text-center">

                {product.ativo ? (

                  <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                    Ativo
                  </span>

                ) : (

                  <span className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                    Inativo
                  </span>

                )}

              </td>

              <td className="px-6 py-5">

                <div className="flex justify-center gap-3">

                  <button
                    type="button"
                    onClick={() => onEdit(product)}
                    className="rounded-full border border-blue-500 px-4 py-2 text-sm text-blue-400 transition hover:bg-blue-500 hover:text-white"
                  >
                    Editar
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (
                        confirm(
                          `Deseja excluir "${product.nome}"?`
                        )
                      ) {
                        onDelete(product.id);
                      }
                    }}
                    className="rounded-full border border-red-500 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500 hover:text-white"
                  >
                    Excluir
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}