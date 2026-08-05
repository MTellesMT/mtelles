"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import ProductTable from "@/components/admin/ProductTable";
import {
  deleteProduct,
  getProducts,
} from "@/services/products";
import { Product } from "@/types/product";

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
const router = useRouter();
const [produtoEmEdicao, setProdutoEmEdicao] =
  useState<Product | null>(null);
  const carregarProdutos = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(data);
    } catch (error) {
      console.error("Erro ao carregar produtos:", error);
      alert("Não foi possível carregar os produtos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {

  const autenticado =
    localStorage.getItem("adminLogado");

  if (autenticado !== "true") {

    router.replace("/login");

    return;

  }

  carregarProdutos();

}, [carregarProdutos, router]);
  async function excluirProduto(id: number) {
    try {
      await deleteProduct(id);

      await carregarProdutos();

      alert("Produto excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Não foi possível excluir o produto.");
    }
  }

 function editarProduto(product: Product) {
  setProdutoEmEdicao(product);

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

  return (
    <main className="min-h-screen bg-[#111111] px-4 py-10 text-white md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.25em] text-[#C8A95B]">
            MTelles
          </p>

          <h1 className="mt-2 text-4xl font-bold">
            Painel Administrativo
          </h1>

          <p className="mt-3 text-[#F3E8D7]/60">
            Cadastre e gerencie os produtos da loja.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">

  <a
    href="/admin/administradores"
    className="rounded-xl bg-[#C8A95B] px-6 py-3 font-semibold text-[#111111] transition hover:scale-105"
  >
    Administradores
  </a>

  <button
    onClick={() => {
      localStorage.removeItem("adminLogado");
      localStorage.removeItem("adminNome");
      localStorage.removeItem("adminNivel");
      localStorage.removeItem("adminId");

      window.location.href = "/login";
    }}
    className="rounded-xl border border-red-500 px-6 py-3 font-semibold text-red-400 transition hover:bg-red-500 hover:text-white"
  >
    Sair
  </button>

</div>
        </div>

        <ProductForm
  onProductCreated={carregarProdutos}
  productToEdit={produtoEmEdicao}
  onCancelEdit={() => setProdutoEmEdicao(null)}
/>

        {loading ? (
          <div className="mt-12 rounded-3xl border border-[#C8A95B]/20 p-10 text-center text-[#F3E8D7]/60">
            Carregando produtos...
          </div>
        ) : (
          <ProductTable
            products={products}
            onDelete={excluirProduto}
            onEdit={editarProduto}
          />
        )}
      </div>
    </main>
  );
}