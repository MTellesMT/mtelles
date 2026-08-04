import { notFound } from "next/navigation";
import { getProducts } from "@/services/products";
import ProductDetails from "@/components/ProductDetails";

interface ProdutoPageProps {
  params: Promise<{
    codigo: string;
  }>;
}

export default async function ProdutoPage({
  params,
}: ProdutoPageProps) {
  const { codigo } = await params;

  const produtos = await getProducts();

  const produto = produtos.find(
    (item) => item.codigo === codigo
  );

  if (!produto) {
    notFound();
  }

  return <ProductDetails produto={produto} />;
}