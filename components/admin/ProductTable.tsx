"use client";

import { Product } from "@/types/product";

interface ProductTableProps {
  products: Product[];

  onDelete: (
    id: number
  ) => void;

  onEdit: (
    product: Product
  ) => void;
}

export default function ProductTable({
  products,
  onDelete,
  onEdit,
}: ProductTableProps) {
  return (
    <div className="mt-12 overflow-hidden rounded-3xl border border-[#C8A95B]/20">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px]">
          <thead className="bg-[#1a1a1a]">
            <tr className="text-left">
              <th className="px-6 py-5">
                Foto
              </th>

              <th className="px-6 py-5">
                Produto
              </th>

              <th className="px-6 py-5">
                Código
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
            {products.length ===
              0 && (
              <tr>
                <td
                  colSpan={8}
                  className="py-10 text-center text-[#F3E8D7]/60"
                >
                  Nenhum produto
                  cadastrado.
                </td>
              </tr>
            )}

            {products.map(
              (product) => (
                <tr
                  key={
                    product.id
                  }
                  className="border-t border-[#C8A95B]/10 transition hover:bg-[#1b1b1b]"
                >
                  {/* FOTO */}

                  <td className="px-6 py-5">
                    {product.imagem_principal ? (
                      <img
                        src={
                          product.imagem_principal
                        }
                        alt={
                          product.nome
                        }
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#222] text-center text-xs text-[#F3E8D7]/50">
                        Sem foto
                      </div>
                    )}
                  </td>

                  {/* PRODUTO */}

                  <td className="px-6 py-5">
                    <p className="font-semibold text-white">
                      {
                        product.nome
                      }
                    </p>

                    <p className="mt-1 text-sm text-[#F3E8D7]/50">
                      {
                        product.marca
                      }
                    </p>
                  </td>

                  {/* CÓDIGO */}

                  <td className="px-6 py-5">
                    {product.codigo ? (
                      <span className="rounded-lg border border-[#C8A95B]/20 bg-[#111] px-3 py-2 text-sm font-semibold text-[#F3E8D7]">
                        {
                          product.codigo
                        }
                      </span>
                    ) : (
                      <span className="text-sm text-[#F3E8D7]/35">
                        Sem código
                      </span>
                    )}
                  </td>

                  {/* CATEGORIA */}

                  <td className="px-6 py-5">
                    {
                      product.categoria
                    }
                  </td>

                  {/* PREÇO */}

                  <td className="px-6 py-5 font-semibold text-[#C8A95B]">
                    {Number(
                      product.preco
                    ).toLocaleString(
                      "pt-BR",
                      {
                        style:
                          "currency",
                        currency:
                          "BRL",
                      }
                    )}
                  </td>

                  {/* ESTOQUE */}

                  <td className="px-6 py-5">
                    <span
                      className={
                        Number(
                          product.estoque
                        ) > 0
                          ? "font-semibold text-white"
                          : "font-semibold text-red-400"
                      }
                    >
                      {
                        product.estoque
                      }
                    </span>
                  </td>

                  {/* STATUS */}

                  <td className="px-6 py-5 text-center">
                    {product.ativo ? (
                      <span className="inline-flex rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
                        Ativo
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                        Inativo
                      </span>
                    )}
                  </td>

                  {/* AÇÕES */}

                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          onEdit(
                            product
                          )
                        }
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
                            onDelete(
                              product.id
                            );
                          }
                        }}
                        className="rounded-full border border-red-500 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500 hover:text-white"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}