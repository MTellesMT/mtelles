"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

import { Product } from "@/types/product";

export interface CartItem {
  produto: Product;
  quantidade: number;
  tamanho: string;
  cor: string;
}

interface CartContextData {
  itens: CartItem[];

  quantidadeItens: number;

  total: number;

  adicionarProduto: (
    produto: Product,
    tamanho: string,
    cor: string
  ) => void;

  removerProduto: (id: number) => void;

  aumentarQuantidade: (
    id: number,
    tamanho: string,
    cor: string
  ) => void;

  diminuirQuantidade: (
    id: number,
    tamanho: string,
    cor: string
  ) => void;

  limparCarrinho: () => void;

  aberto: boolean;

  abrirCarrinho: () => void;

  fecharCarrinho: () => void;
}

const CartContext = createContext<CartContextData>(
  {} as CartContextData
);

interface Props {
  children: ReactNode;
}

export function CartProvider({
  children,
}: Props) {
  const [itens, setItens] = useState<CartItem[]>(
    []
  );

  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    const carrinho = localStorage.getItem(
      "mtelles-cart"
    );

    if (carrinho) {
      setItens(JSON.parse(carrinho));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "mtelles-cart",
      JSON.stringify(itens)
    );
  }, [itens]);

  function adicionarProduto(
    produto: Product,
    tamanho: string,
    cor: string
  ) {
    setItens((estadoAtual) => {
      const existe = estadoAtual.find(
        (item) =>
          item.produto.id === produto.id &&
          item.tamanho === tamanho &&
          item.cor === cor
      );

      if (existe) {
        return estadoAtual.map((item) =>
          item.produto.id === produto.id &&
          item.tamanho === tamanho &&
          item.cor === cor
            ? {
                ...item,
                quantidade:
                  item.quantidade + 1,
              }
            : item
        );
      }

      return [
        ...estadoAtual,
        {
          produto,
          quantidade: 1,
          tamanho,
          cor,
        },
      ];
    });
  }

  function removerProduto(id: number) {
    setItens((estadoAtual) =>
      estadoAtual.filter(
        (item) => item.produto.id !== id
      )
    );
  }

  function aumentarQuantidade(
    id: number,
    tamanho: string,
    cor: string
  ) {
    setItens((estadoAtual) =>
      estadoAtual.map((item) =>
        item.produto.id === id &&
        item.tamanho === tamanho &&
        item.cor === cor
          ? {
              ...item,
              quantidade:
                item.quantidade + 1,
            }
          : item
      )
    );
  }

  function diminuirQuantidade(
    id: number,
    tamanho: string,
    cor: string
  ) {
    setItens((estadoAtual) =>
      estadoAtual
        .map((item) =>
          item.produto.id === id &&
          item.tamanho === tamanho &&
          item.cor === cor
            ? {
                ...item,
                quantidade:
                  item.quantidade - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantidade > 0
        )
    );
  }

  function limparCarrinho() {
    setItens([]);
  }

  function abrirCarrinho() {
    setAberto(true);
  }

  function fecharCarrinho() {
    setAberto(false);
  }

  const quantidadeItens = useMemo(() => {
    return itens.reduce(
      (total, item) =>
        total + item.quantidade,
      0
    );
  }, [itens]);

  const total = useMemo(() => {
    return itens.reduce(
      (valor, item) =>
        valor +
        item.produto.preco *
          item.quantidade,
      0
    );
  }, [itens]);

  return (
    <CartContext.Provider
      value={{
        itens,

        quantidadeItens,

        total,

        adicionarProduto,

        removerProduto,

        aumentarQuantidade,

        diminuirQuantidade,

        limparCarrinho,

        aberto,

        abrirCarrinho,

        fecharCarrinho,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}