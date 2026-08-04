"use client";

import { useState } from "react";
import { uploadImage } from "@/services/storage";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUpload({
  value,
  onChange,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function selecionarImagem(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const arquivos = e.target.files;

    if (!arquivos) return;

    setLoading(true);

    try {
      const urls: string[] = [...value];

      for (const arquivo of Array.from(arquivos)) {
        const url = await uploadImage(arquivo);
        urls.push(url);
      }

      onChange(urls);

    } catch (error) {
      console.error(error);
      alert("Erro ao enviar imagens.");
    } finally {
      setLoading(false);
    }
  }

  function remover(index: number) {
    const lista = [...value];
    lista.splice(index, 1);
    onChange(lista);
  }

  return (
    <div className="space-y-5">

      <label
        className="inline-flex cursor-pointer rounded-full bg-[#C8A95B] px-6 py-3 font-semibold text-[#111111]"
      >
        {loading ? "Enviando..." : "Selecionar imagens"}

        <input
          type="file"
          multiple
          accept="image/*"
          hidden
          onChange={selecionarImagem}
        />
      </label>

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {value.map((img, index) => (

            <div
              key={index}
              className="relative"
            >
              <img
                src={img}
                alt=""
                className="h-36 w-full rounded-xl object-cover border border-[#333]"
              />

              <button
                type="button"
                onClick={() => remover(index)}
                className="absolute right-2 top-2 rounded-full bg-red-600 px-2 py-1 text-xs text-white"
              >
                ✕
              </button>

              {index === 0 && (
                <span className="absolute bottom-2 left-2 rounded bg-[#C8A95B] px-2 py-1 text-xs font-bold text-[#111]">
                  Principal
                </span>
              )}
            </div>

          ))}

        </div>
      )}

    </div>
  );
}