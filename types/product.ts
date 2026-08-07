export interface Product {
  id: number;

  created_at?: string;

  nome: string;

  marca: string;

  codigo: string;

  categoria: string;

  descricao: string;

  preco: number;

  material: string;

  altura_do_calcanhar: string;

  tamanhos: string;

  cores: string;

  imagem_principal: string;

  galeria: string;

  em_destaque: boolean;

  mais_vendido: boolean;

  ativo: boolean;

  estoque: number;
}