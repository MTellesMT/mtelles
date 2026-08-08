"use client";

import {
  useEffect,
  useState,
} from "react";

import ImageUpload from "./ImageUpload";

import {
  createProduct,
  updateProduct,
} from "@/services/products";

import {
  categoriasProduto,
  marcasProduto,
  coresProduto,
  tamanhosProduto,
} from "@/data/productOptions";

import { Product } from "@/types/product";


interface ProductFormProps {

  onProductCreated?: () => void;

  productToEdit?: Product | null;

  onCancelEdit?: () => void;

}



export default function ProductForm({

  onProductCreated,

  productToEdit,

  onCancelEdit,

}: ProductFormProps) {


  const [loading,setLoading] =
    useState(false);



  const [nome,setNome] =
    useState("");

  const [marca,setMarca] =
    useState("");

  const [novaMarca,setNovaMarca] =
    useState("");

  const [categoria,setCategoria] =
    useState("");

  const [novaCategoria,setNovaCategoria] =
    useState("");

    const [coresSelecionadas, setCoresSelecionadas] =
  useState<string[]>([]);

const [tamanhosSelecionados, setTamanhosSelecionados] =
  useState<string[]>([]);

const [novaCor, setNovaCor] =
  useState("");

const [novoTamanho, setNovoTamanho] =
  useState("");

const [mostrarNovaCor, setMostrarNovaCor] =
  useState(false);

const [mostrarNovoTamanho, setMostrarNovoTamanho] =
  useState(false);


const [listaCores, setListaCores] =
  useState<string[]>(coresProduto);


const [listaTamanhos, setListaTamanhos] =
  useState<string[]>(tamanhosProduto);

  const [codigo,setCodigo] =
    useState("");

  const [descricao,setDescricao] =
    useState("");

  const [preco,setPreco] =
    useState("");

  const [estoque,setEstoque] =
    useState("");

  const [cores,setCores] =
    useState("");

  const [tamanhos,setTamanhos] =
    useState("");


  const [mostrarNovaMarca,setMostrarNovaMarca] =
    useState(false);

  const [mostrarNovaCategoria,setMostrarNovaCategoria] =
    useState(false);



  const [listaMarcas,setListaMarcas] =
    useState<string[]>(marcasProduto);


  const [listaCategorias,setListaCategorias] =
    useState<string[]>(categoriasProduto);



  const [imagens,setImagens] =
    useState<string[]>([]);



  const [ativo,setAtivo] =
    useState(true);


  const [destaque,setDestaque] =
    useState(false);


  const [maisVendido,setMaisVendido] =
    useState(false);



  useEffect(()=>{


    if(!productToEdit){

      return;

    }


    setNome(productToEdit.nome);

    setMarca(productToEdit.marca);

    setCategoria(productToEdit.categoria);

    setCodigo(productToEdit.codigo);

    setDescricao(productToEdit.descricao);

    setPreco(String(productToEdit.preco));

    setEstoque(String(productToEdit.estoque));

    setCoresSelecionadas(
  productToEdit.cores
    ? productToEdit.cores
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : []
);

setTamanhosSelecionados(
  productToEdit.tamanhos
    ? productToEdit.tamanhos
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    : []
);


    let galeria:string[]=[];


    try{

      galeria =
        productToEdit.galeria
        ? JSON.parse(productToEdit.galeria)
        : [];


    }catch{

      galeria=[];

    }



    setImagens([

      productToEdit.imagem_principal,

      ...galeria,

    ]);



    setAtivo(productToEdit.ativo);

    setDestaque(productToEdit.em_destaque);

    setMaisVendido(
      productToEdit.mais_vendido ?? false
    );


  },[productToEdit]);




  function adicionarMarca(){


    const valor =
      novaMarca.trim();



    if(!valor){

      return;

    }



    setListaMarcas(
      (lista)=>
      [
        ...lista,
        valor
      ]
    );



    setMarca(valor);


    setNovaMarca("");

    setMostrarNovaMarca(false);


  }




  function adicionarCategoria(){


    const valor =
      novaCategoria.trim();



    if(!valor){

      return;

    }



    setListaCategorias(
      (lista)=>
      [
        ...lista,
        valor
      ]
    );



    setCategoria(valor);


    setNovaCategoria("");

    setMostrarNovaCategoria(false);


  }

function adicionarCor(){

  const valor =
    novaCor.trim();


  if(!valor){
    return;
  }


  if(!listaCores.includes(valor)){

    setListaCores(
      (lista:string[]) => [
        ...lista,
        valor,
      ]
    );

  }


  setCoresSelecionadas(
    (selecionadas:string[]) => {

      if(selecionadas.includes(valor)){
        return selecionadas;
      }

      return [
        ...selecionadas,
        valor,
      ];

    }
  );


  setNovaCor("");

  setMostrarNovaCor(false);

}


function adicionarTamanho(){

  const valor =
    novoTamanho.trim();


  if(!valor){
    return;
  }


  if(!listaTamanhos.includes(valor)){

    setListaTamanhos(
      (lista:string[]) => [
        ...lista,
        valor,
      ]
    );

  }


  setTamanhosSelecionados(
    (selecionados:string[]) => {

      if(selecionados.includes(valor)){
        return selecionados;
      }

      return [
        ...selecionados,
        valor,
      ];

    }
  );


  setNovoTamanho("");

  setMostrarNovoTamanho(false);

}


  async function salvarProduto(){


    if(!nome || !preco){

      alert(
        "Preencha nome e preço."
      );

      return;

    }



    if(imagens.length===0){

      alert(
        "Selecione pelo menos uma imagem."
      );

      return;

    }



    try{


      setLoading(true);



      const dadosProduto={


        nome,

        marca,

        codigo,

        categoria,

        descricao,


        preco:Number(preco),


        estoque:Number(estoque),


        cores: coresSelecionadas.join(", "),

        tamanhos: tamanhosSelecionados.join(", "),


        imagem_principal:
          imagens[0],


        galeria:
          JSON.stringify(
            imagens.slice(1)
          ),


        em_destaque:
          destaque,


        mais_vendido:
          maisVendido,


        ativo,


      };



      if(productToEdit){


        await updateProduct(
          productToEdit.id,
          dadosProduto
        );


      }else{


        await createProduct(
          dadosProduto
        );


      }


      setNome("");

      setMarca("");

      setCategoria("");

      setCodigo("");

      setDescricao("");

      setPreco("");

      setEstoque("");

      setCores("");

      setTamanhos("");

      setImagens([]);



      if(onProductCreated){

        await onProductCreated();

      }



      alert(
        productToEdit
        ? "Produto atualizado com sucesso!"
        : "Produto cadastrado com sucesso!"
      );



    }catch(error){


      console.error(error);


      alert(
        "Erro ao salvar produto."
      );


    }finally{


      setLoading(false);


    }


  }
    return (

    <div className="rounded-3xl border border-[#C8A95B]/20 bg-[#181818] p-8">


      <h2 className="mb-8 text-3xl font-bold">

        {productToEdit
          ? "Editar Produto"
          : "Novo Produto"}

      </h2>



      <div className="grid gap-6 md:grid-cols-2">



        <div>

          <label className="mb-2 block">
            Nome
          </label>


          <input
            value={nome}
            onChange={(e)=>
              setNome(e.target.value)
            }
            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
          />

        </div>





        <div>

          <label className="mb-2 block">
            Marca
          </label>


          <select

            value={marca}

            onChange={(e)=>{

              const valor =
                e.target.value;


              if(valor==="__nova__"){

                setMostrarNovaMarca(true);
                setMarca("");

                return;

              }


              setMarca(valor);

            }}

            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"

          >


            <option value="">
              Selecione uma marca
            </option>


            {listaMarcas.map(
              (item)=>(
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}


            <option value="__nova__">
              Criar nova marca
            </option>


          </select>



          {mostrarNovaMarca && (

            <div className="mt-3">

              <input

                value={novaMarca}

                onChange={(e)=>
                  setNovaMarca(
                    e.target.value
                  )
                }

                placeholder="Digite a nova marca"

                className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"

              />


              <button

                type="button"

                onClick={adicionarMarca}

                className="mt-3 rounded-xl bg-[#C8A95B] px-5 py-3 text-[#111]"

              >

                Salvar marca

              </button>


            </div>

          )}

        </div>





        <div>

          <label className="mb-2 block">
            Código
          </label>


          <input

            value={codigo}

            onChange={(e)=>
              setCodigo(
                e.target.value
              )
            }

            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"

          />

        </div>





        <div>

          <label className="mb-2 block">
            Categoria
          </label>


          <select

            value={categoria}

            onChange={(e)=>{

              const valor =
                e.target.value;


              if(valor==="__nova__"){

                setMostrarNovaCategoria(true);
                setCategoria("");

                return;

              }


              setCategoria(valor);

            }}

            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"

          >


            <option value="">
              Selecione uma categoria
            </option>


            {listaCategorias.map(
              (item)=>(
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              )
            )}


            <option value="__nova__">
              Criar nova categoria
            </option>


          </select>




          {mostrarNovaCategoria && (

            <div className="mt-3">


              <input

                value={novaCategoria}

                onChange={(e)=>
                  setNovaCategoria(
                    e.target.value
                  )
                }

                placeholder="Digite a nova categoria"

                className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"

              />



              <button

                type="button"

                onClick={adicionarCategoria}

                className="mt-3 rounded-xl bg-[#C8A95B] px-5 py-3 text-[#111]"

              >

                Salvar categoria

              </button>


            </div>

          )}

        </div>



<div>

  <label className="mb-2 block">
    Cor
  </label>

  <select
  value=""
  onChange={(e) => {
    const valor = e.target.value;

    if (valor === "__nova__") {
      setMostrarNovaCor(true);
      return;
    }

    if (!valor) {
      return;
    }

    setCoresSelecionadas((selecionadas) => {
      if (selecionadas.includes(valor)) {
        return selecionadas;
      }

      return [...selecionadas, valor];
    });
  }}
  className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
>
  <option value="">
    Selecione uma cor
  </option>

  {listaCores.map((item: string) => (
    <option
      key={item}
      value={item}
    >
      {item}
    </option>
  ))}

  <option value="__nova__">
    Criar nova cor
  </option>
</select>


  {mostrarNovaCor && (

    <div className="mt-3">

      <input
        value={novaCor}
        onChange={(e) =>
          setNovaCor(e.target.value)
        }
        placeholder="Digite a nova cor"
        className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
      />


      <button
        type="button"
        onClick={adicionarCor}
        className="mt-3 rounded-xl bg-[#C8A95B] px-5 py-3 text-[#111]"
      >
        Salvar cor
      </button>

    </div>

  )}

</div>


<div>

  <label className="mb-2 block">
    Tamanho
  </label>


  <select
  value=""
  onChange={(e) => {
    const valor = e.target.value;

    if (valor === "__novo__") {
      setMostrarNovoTamanho(true);
      return;
    }

    if (!valor) {
      return;
    }

    setTamanhosSelecionados((selecionados) => {
      if (selecionados.includes(valor)) {
        return selecionados;
      }

      return [...selecionados, valor];
    });
  }}
  className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
>
  <option value="">
    Selecione um tamanho
  </option>

  {listaTamanhos.map((item: string) => (
    <option
      key={item}
      value={item}
    >
      {item}
    </option>
  ))}

  <option value="__novo__">
    Criar novo tamanho
  </option>
</select>


  {mostrarNovoTamanho && (

    <div className="mt-3">

      <input
        value={novoTamanho}
        onChange={(e) =>
          setNovoTamanho(e.target.value)
        }
        placeholder="Digite o novo tamanho"
        className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"
      />


      <button
        type="button"
        onClick={adicionarTamanho}
        className="mt-3 rounded-xl bg-[#C8A95B] px-5 py-3 text-[#111]"
      >
        Salvar tamanho
      </button>

    </div>

  )}

</div>

        <div>

          <label className="mb-2 block">
            Preço
          </label>


          <input

            type="number"

            value={preco}

            onChange={(e)=>
              setPreco(
                e.target.value
              )
            }

            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"

          />

        </div>





        <div>

          <label className="mb-2 block">
            Estoque
          </label>


          <input

            type="number"

            value={estoque}

            onChange={(e)=>
              setEstoque(
                e.target.value
              )
            }

            className="w-full rounded-xl border border-[#333] bg-[#111] px-4 py-3"

          />

        </div>



      </div>



      <div className="mt-8">


        <ImageUpload

  value={imagens}

  onChange={setImagens}

/>

      </div>




      <button

        type="button"

        onClick={salvarProduto}

        disabled={loading}

        className="mt-8 rounded-xl bg-[#C8A95B] px-8 py-3 font-bold text-[#111]"

      >

        {loading
          ? "Salvando..."
          : productToEdit
            ? "Atualizar Produto"
            : "Cadastrar Produto"
        }

      </button>



    </div>

  );

}