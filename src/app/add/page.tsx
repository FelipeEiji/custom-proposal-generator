"use client";
import { useProposal } from "@/context/ProposalContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "@/types/Product";

export default function AddPage() {
  const [productsByCategory, setProductsByCategory] = useState<
    Record<string, Product[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selected, setSelected] = useState<Product | null>(null);
  const [price, setPrice] = useState<string>("");
  const { addItem } = useProposal();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then(setProductsByCategory)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    activeCategory && productsByCategory[activeCategory]
      ? productsByCategory[activeCategory]
      : [];

  const confirm = () => {
    if (!selected || !price) return;
    const numericValue =
      parseFloat(price.replace(/\D/g, "").replace(/^0+/, "") || "0") / 100;
    addItem({ ...selected, price: numericValue });
    router.push("/builder");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
        <span className="mt-4 text-xl font-semibold text-gray-700">
          Carregando produtos...
        </span>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto bg-gray-50 min-h-screen w-full">
      <div className="max-w-3x1 mx auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
          Adicionar Produto à Proposta
        </h1>

        {!activeCategory ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {Object.keys(productsByCategory).map((cat) => (
                <button
                  key={cat}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-semibold shadow-md text-lg"
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="text-center">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow font-medium"
                onClick={() => router.push("/builder")}
              >
                Voltar à Lista
              </button>
            </div>
          </>
        ) : !selected ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 pb-6">
              {filtered.map((p) => (
                <div
                  key={p.code}
                  className="border rounded-xl p-4 cursor-pointer hover:shadow-lg transition bg-white hover:border-blue-400"
                  onClick={() => setSelected(p)}
                >
                  <img
                    src={p.imageURL}
                    className="w-full h-40 object-contain mb-3"
                    alt={p.name}
                  />
                  <h2 className="font-bold text-lg text-center text-gray-800 mb-1">
                    {p.name}
                  </h2>
                </div>
              ))}
            </div>
            <div className="text-center mt-4">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg shadow font-medium"
                onClick={() => setActiveCategory(null)}
              >
                Voltar às Categorias
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {selected.name}
              </h2>
            </div>
            <input
              type="text"
              placeholder="Preço unitário"
              className="border px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={price}
              onChange={(e) => {
                const raw = e.target.value
                  .replace(/\D/g, "")
                  .replace(/^0+/, "");
                const numeric = (parseInt(raw || "0", 10) / 100).toFixed(2);
                setPrice(
                  Number(numeric).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                  })
                );
              }}
            />
            <div className="flex justify-center gap-6">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow font-semibold"
                onClick={confirm}
              >
                ✅ Confirmar e adicionar
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg shadow font-semibold"
                onClick={() => setSelected(null)}
              >
                🔙 Voltar à Lista
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
