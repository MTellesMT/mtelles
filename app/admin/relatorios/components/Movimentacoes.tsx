interface Movimentacao {
  id: number;
  tipo: string;
  produto: string;
  quantidade: number;
  motivo: string;
  created_at: string;
}

interface MovimentacoesProps {
  loading: boolean;
  movimentacoes: Movimentacao[];
}

export default function Movimentacoes({
  loading,
  movimentacoes,
}: MovimentacoesProps) {
  return (
    <section className="mt-14">

      <h2 className="border-b border-[#C8A95B]/30 pb-3 text-2xl font-black text-[#C8A95B]">
        ÚLTIMAS MOVIMENTAÇÕES
      </h2>

      <div className="mt-8 overflow-hidden rounded-2xl border border-[#2A2A2A]">

        <table className="w-full">

          <thead className="bg-[#181818]">

            <tr>

              <th className="p-4 text-left">Data</th>
              <th className="p-4 text-left">Produto</th>
              <th className="p-4 text-center">Tipo</th>
              <th className="p-4 text-center">Qtd.</th>
              <th className="p-4 text-left">Motivo</th>

            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center"
                >
                  Carregando...
                </td>
              </tr>

            ) : movimentacoes.length === 0 ? (

              <tr>
                <td
                  colSpan={5}
                  className="p-6 text-center text-[#F3E8D7]/60"
                >
                  Nenhuma movimentação encontrada.
                </td>
              </tr>

            ) : (

              movimentacoes.map((mov) => (

                <tr
                  key={mov.id}
                  className="border-t border-[#2A2A2A]"
                >
                  <td className="p-4">
                    {new Date(
                      mov.created_at
                    ).toLocaleDateString("pt-BR")}
                  </td>

                  <td className="p-4">
                    {mov.produto}
                  </td>

                  <td className="p-4 text-center">
                    {mov.tipo}
                  </td>

                  <td className="p-4 text-center">
                    {mov.quantidade}
                  </td>

                  <td className="p-4">
                    {mov.motivo}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </section>
  );
}