"use client";

import Link from "next/link";
import {
  Camera,
  ChevronRight,
  Mail,
  MapPin,
  MessageCircle,
  PackageCheck,
  Phone,
  Truck,
} from "lucide-react";

export default function Footer() {
  const anoAtual =
    new Date().getFullYear();

  return (
    <footer
      id="contato"
      className="mt-24 scroll-mt-24 border-t border-[#C8A95B]/20 bg-[#111111]"
    >
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
              A MTelles nasceu para
              oferecer sofisticação,
              conforto e estilo em cada
              detalhe. Nossa missão é
              levar elegância para o dia
              a dia de todas as mulheres.
            </p>

            <a
              href="https://wa.me/5521966682941"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#C8A95B] px-7 py-4 font-semibold text-[#111111] transition hover:scale-105"
            >
              <MessageCircle
                size={20}
              />

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
                <ChevronRight
                  size={18}
                />

                Início
              </Link>

              <Link
                href="/#colecao"
                className="flex items-center gap-2 text-[#F3E8D7]/70 transition hover:text-[#C8A95B]"
              >
                <ChevronRight
                  size={18}
                />

                Coleção
              </Link>

              <Link
                href="/#destaques"
                className="flex items-center gap-2 text-[#F3E8D7]/70 transition hover:text-[#C8A95B]"
              >
                <ChevronRight
                  size={18}
                />

                Destaques
              </Link>

              <Link
                href="/#contato"
                className="flex items-center gap-2 text-[#F3E8D7]/70 transition hover:text-[#C8A95B]"
              >
                <ChevronRight
                  size={18}
                />

                Contato
              </Link>
            </div>
          </div>

          {/* Atendimento */}

          <div>
            <h3 className="text-xl font-bold text-white">
              Atendimento
            </h3>

            <div className="mt-8 flex flex-col gap-6">
              <a
                href="tel:+5521966682941"
                className="flex items-center gap-4 text-[#F3E8D7]/70 transition hover:text-[#C8A95B]"
              >
                <Phone
                  size={22}
                  className="shrink-0 text-[#C8A95B]"
                />

                <span>
                  (21) 96668-2941
                </span>
              </a>

              <a
                href="https://wa.me/5521966682941"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-[#F3E8D7]/70 transition hover:text-[#C8A95B]"
              >
                <MessageCircle
                  size={22}
                  className="shrink-0 text-[#C8A95B]"
                />

                <span>
                  WhatsApp
                </span>
              </a>

              <a
                href="mailto:mtelles2026@gmail.com"
                className="flex items-center gap-4 text-[#F3E8D7]/70 transition hover:text-[#C8A95B]"
              >
                <Mail
                  size={22}
                  className="shrink-0 text-[#C8A95B]"
                />

                <span className="break-all">
                  mtelles2026@gmail.com
                </span>
              </a>

              <a
                href="https://www.instagram.com/mtelles_oficia/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 text-[#F3E8D7]/70 transition hover:text-[#C8A95B]"
              >
                <Camera
  size={22}
  className="shrink-0 text-[#C8A95B]"
/>

                <span>
                  @mtelles_oficia
                </span>
              </a>

              <div className="flex items-center gap-4">
                <MapPin
                  size={22}
                  className="shrink-0 text-[#C8A95B]"
                />

                <span className="text-[#F3E8D7]/70">
                  Rio de Janeiro •
                  Brasil
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
              Atendimento rápido pelo
              WhatsApp, pagamento seguro,
              entrega e produtos
              selecionados para oferecer
              a melhor experiência de
              compra.
            </p>

            <div className="mt-8 space-y-3">
              <div className="rounded-2xl border border-[#C8A95B]/20 bg-[#181818] p-4">
                <p className="font-semibold text-white">
                  ✓ Compra Segura
                </p>
              </div>

              <div className="rounded-2xl border border-[#C8A95B]/20 bg-[#181818] p-4">
                <p className="font-semibold text-white">
                  ✓ Atendimento
                  Humanizado
                </p>
              </div>

              <div className="rounded-2xl border border-[#C8A95B]/20 bg-[#181818] p-4">
                <p className="font-semibold text-white">
                  ✓ Produtos Premium
                </p>
              </div>

              <div className="rounded-2xl border border-[#C8A95B]/20 bg-[#181818] p-4">
                <div className="flex items-center gap-3">
                  <Truck
                    size={20}
                    className="shrink-0 text-[#C8A95B]"
                  />

                  <p className="font-semibold text-white">
                    Entrega disponível
                  </p>
                </div>

                <p className="mt-2 text-sm leading-6 text-[#F3E8D7]/55">
                  Consulte pelo WhatsApp
                  as opções, prazo e valor
                  da entrega para sua
                  região.
                </p>
              </div>

              <div className="rounded-2xl border border-[#C8A95B]/20 bg-[#181818] p-4">
                <div className="flex items-center gap-3">
                  <PackageCheck
                    size={20}
                    className="shrink-0 text-[#C8A95B]"
                  />

                  <p className="font-semibold text-white">
                    Pedido acompanhado
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#C8A95B]/15 bg-[#0a0a0a]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-6 py-8 text-center md:flex-row md:text-left">
          <p className="text-sm text-[#F3E8D7]/45">
            © {anoAtual} MTelles. Todos
            os direitos reservados.
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