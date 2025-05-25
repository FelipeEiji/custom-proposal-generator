"use client";
import { useProposal } from "@/context/ProposalContext";
import { useRouter } from "next/navigation";
import PDFPreview from "@/components/PDFPreview";
import { usePDFGenerator } from "@/components/PDFGenerator";
import { useState } from "react";
import ConfirmationModal from "../../components/ConfirmationModal";

export default function BuilderPage() {
  const { items, removeItem, resetItems } = useProposal();
  const router = useRouter();
  const [showPreview, setShowPreview] = useState(false);
  const { generatePDF, loading } = usePDFGenerator();

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="p-6 max-w-5xl w-full mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900">
          📦 Itens da Proposta
        </h1>
        <p className="text-center text-gray-500 text-sm mt-1">
          Revise os produtos antes de gerar o PDF final
        </p>
      </header>

      <main className="flex-1 overflow-y-auto px-6 max-w-5xl w-full mx-auto pb-48">
        {items.length === 0 ? (
          <div className="text-center text-gray-400 mt-24">
            <p className="text-lg">🗂️ Nenhum item adicionado ainda.</p>
            <p className="text-sm mt-2">
              Use o botão abaixo para adicionar produtos à proposta.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li
                key={item.code}
                className="relative border rounded-xl p-5 shadow-md bg-white hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {item.name}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        Quantidade: {item.quantity}
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        Preço:{" "}
                        {item.price.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>
                  </div>
                  <ConfirmationModal
                    title="Remover Produto"
                    description={`Deseja realmente remover "${item.name}" da proposta?`}
                    confirmText="Remover"
                    cancelText="Cancelar"
                    variant="destructive"
                    onConfirm={() => {
                      removeItem(item.code);
                    }}
                    trigger={
                      <button
                        className="text-red-500 hover:text-red-600 text-lg font-semibold px-2 py-1 rounded transition"
                        title="Remover item"
                      >
                        ✖
                      </button>
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-md p-4 z-30">
        <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
          <button
            className="bg-[#00a651] hover:bg-[#009344] text-white font-semibold px-6 py-2 rounded-md shadow-md flex items-center gap-2 transition"
            onClick={() => router.push("/add")}
          >
            <span className="text-xl leading-none">➕</span> Adicionar Item
          </button>
          {items.length > 0 && (
            <>
              <button
                className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-2 rounded-md shadow-md transition"
                onClick={() => setShowPreview(true)}
              >
                👁️ Visualizar PDF
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-md transition flex items-center justify-center min-w-[160px]"
                onClick={generatePDF}
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                ) : (
                  "📄 Gerar PDF"
                )}
              </button>
              <ConfirmationModal
                title="Resetar Lista"
                description="Ao resetar a lista de itens, todos os itens adicionados serão removidos."
                confirmText="Resetar"
                cancelText="Cancelar"
                variant="destructive"
                onConfirm={resetItems}
                trigger={
                  <button className="flex items-center justify-center gap-2 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 shadow-md transition">
                    🗑️ Resetar Lista
                  </button>
                }
              />
            </>
          )}
        </div>
      </div>

      <div className="hidden">
        <PDFPreview />
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Pré-visualização da Proposta
              </h2>
              <button
                className="text-sm text-red-500 hover:underline"
                onClick={() => setShowPreview(false)}
              >
                Fechar
              </button>
            </div>
            <PDFPreview />
          </div>
        </div>
      )}
    </div>
  );
}
