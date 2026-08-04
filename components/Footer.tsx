"use client";

import Link from "next/link";
import {
  ChevronRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

export default function Footer() {
  const anoAtual = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-[#C8A95B]/20 bg-[#111111]">

      <div className="mx-auto max-w-7xl px-6 py-20">

        <div className="grid gap-16 lg:grid-cols-4">

          {/* Marca */}

          <div>

            <h2 className="text-4xl font-black tracking-wide text-[#C8A95B]">
              MTelles
            </h2>

            <p className="mt-3 text-sm uppercase tracking-[0.35em] text-[#C8A95B]/70">
              Elegância em cada passo
            </p>

            <p className="mt-8 leading-8 text-[#F3E8D7]/70">
              A MTelles nasceu para oferecer
              sofisticação, conforto e estilo em
              cada detalhe. Nossa missão é levar
              elegância para o dia a dia de todas
              as mulheres.
            </p>

            <a
              href="https://wa.me/5521966682941"
              target="_blank"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#C8A95B] px-7 py-4 font-semibold text-[#111111] transition hover:scale-105"
            >
              <MessageCircle size={20} />

              Comprar pelo WhatsApp
            </a>

          </div>

          {/* Navegação */}

          <div>

            <h3 className="text-xl font-bold text-white">
              Navegação
            </h3>

            <div className="mt-8 flex flex-col gap-4">

              <Link
                href="/"
                className="flex items-center gap-2 text-[#F3E8D7]/70 transition hover:text-[#C8A95B]"
              >
                <ChevronRight size={18} />
                Início
              </Link>

              <Link
                href="#colecao"
                className="flex items-center gap-2 text-[#F3E8D7]/70 transition hover:text-[#C8A95B]"
              >
                <ChevronRight size={18} />
                Coleção
              </Link>

              <Link
                href="#destaques"
                className="flex items-center gap-2 text-[#F3E8D7]/70 transition hover:text-[#C8A95B]"
              >
                <ChevronRight size={18} />
                Destaques
              </Link>

              <Link
                href="/admin"
                className="flex items-center gap-2 text-[#F3E8D7]/70 transition hover:text-[#C8A95B]"
              >
                <ChevronRight size={18} />
                Administração
              </Link>

            </div>

          </div>

          {/* Atendimento */}

          <div>

            <h3 className="text-xl font-bold text-white">
              Atendimento
            </h3>

            <div className="mt-8 flex flex-col gap-6">

              <div className="flex items-center gap-4">

                <Phone
                  size={22}
                  className="text-[#C8A95B]"
                />

                <span className="text-[#F3E8D7]/70">
                  (21) 96668-2941
                </span>

              </div>

              <div className="flex items-center gap-4">

                <MessageCircle
                  size={22}
                  className="text-[#C8A95B]"
                />

                <span className="text-[#F3E8D7]/70">
                  WhatsApp
                </span>

              </div>

              <div className="flex items-center gap-4">

                <Mail
                  size={22}
                  className="text-[#C8A95B]"
                />

                <span className="text-[#F3E8D7]/70">
                  contato@mtelles.com.br
                </span>

              </div>

              <div className="flex items-center gap-4">

                <MapPin
                  size={22}
                  className="text-[#C8A95B]"
                />

                <span className="text-[#F3E8D7]/70">
                  Rio de Janeiro • Brasil
                </span>

              </div>

            </div>

          </div>

          {/* Informações */}

          <div>

            <h3 className="text-xl font-bold text-white">
              Informações
            </h3>

            <p className="mt-8 leading-8 text-[#F3E8D7]/70">
              Atendimento rápido pelo WhatsApp,
              pagamento seguro e produtos
              selecionados para oferecer a melhor
              experiência de compra.
            </p>

            <div className="mt-8 space-y-3">

              <div className="rounded-2xl border border-[#C8A95B]/20 bg-[#181818] p-4">

                <p className="font-semibold text-white">
                  ✓ Compra Segura
                </p>

              </div>

              <div className="rounded-2xl border border-[#C8A95B]/20 bg-[#181818] p-4">

                <p className="font-semibold text-white">
                  ✓ Atendimento Humanizado
                </p>

              </div>

              <div className="rounded-2xl border border-[#C8A95B]/20 bg-[#181818] p-4">

                <p className="font-semibold text-white">
                  ✓ Produtos Premium
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>      <div className="border-t border-[#C8A95B]/15 bg-[#0a0a0a]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-8 text-center md:flex-row md:text-left">
          <p className="text-sm text-[#F3E8D7]/45">
            © {anoAtual} MTelles. Todos os direitos reservados.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              href="#"
              className="text-[#F3E8D7]/45 transition hover:text-[#C8A95B]"
            >
              Política de Privacidade
            </Link>

            <Link
              href="#"
              className="text-[#F3E8D7]/45 transition hover:text-[#C8A95B]"
            >
              Política de Trocas
            </Link>

            <Link
              href="#"
              className="text-[#F3E8D7]/45 transition hover:text-[#C8A95B]"
            >
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}