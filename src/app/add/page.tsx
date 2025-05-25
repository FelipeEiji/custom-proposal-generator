"use client";
import { useProposal } from "@/context/ProposalContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dispenser } from "@/types/Dispenser";
import { Supply } from "@/types/Supply";
import Image from "next/image";

export default function AddPage() {
  const [productsByCategory, setProductsByCategory] = useState<
    Record<string, Dispenser[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedDispenser, setSelectedDispenser] = useState<Dispenser | null>(
    null
  );
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSupply, setSelectedSupply] = useState<Supply | null>(null);
  const [price, setPrice] = useState<string>("");
  const { addItem } = useProposal();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 productsByCategory:", data);
        setProductsByCategory(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const confirm = () => {
    if (!selectedDispenser || !selectedSupply || !price || !selectedColor) return;
    const numericValue =
      parseFloat(price.replace(/\D/g, "").replace(/^0+/, "") || "0") / 100;
    addItem({
      name: `${selectedDispenser.name} - ${selectedColor} - ${selectedSupply.name}`,
      description: selectedSupply.description,
      quantity: selectedSupply.quantity,
      code: selectedSupply.code,
      imageURL:
        selectedSupply.imageURLsByColor[selectedColor] ||
        selectedSupply.imageURL,
      category: selectedDispenser.category,
      price: numericValue,
    });
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
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-900">
          Adicionar Produto à Proposta
        </h1>

        {!activeCategory && (
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
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg shadow font-semibold"
                onClick={() => router.push("/builder")}
              >
                🔙 Voltar à Lista
              </button>
            </div>
          </>
        )}

        {activeCategory && !selectedDispenser && (
          <>
            <h2 className="text-2xl font-bold text-center mb-4">Selecionar Dispenser</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {productsByCategory[activeCategory]?.map((dispenser) => (
                <div
                  key={dispenser.code}
                  className={`border rounded-xl p-4 cursor-pointer hover:shadow-lg transition bg-white hover:border-blue-400`}
                  onClick={() => {
                    setSelectedDispenser(dispenser);
                    setSelectedColor(null);
                    setSelectedSupply(null);
                  }}
                >
                  <div className="relative w-full h-40 mb-3">
                    <Image
                      src={dispenser.imageURL}
                      alt={dispenser.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h2 className="font-bold text-lg text-center text-gray-800">
                    {dispenser.name}
                  </h2>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg shadow font-semibold"
                onClick={() => setActiveCategory(null)}
              >
                🔙 Voltar às Categorias
              </button>
            </div>
          </>
        )}

        {selectedDispenser && selectedDispenser.colors.length > 0 && !selectedColor && (
          <>
            <h2 className="text-2xl font-bold text-center mb-4">Selecionar Cor</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {selectedDispenser.colors.map((color) => (
                <button
                  key={color}
                  className={`px-4 py-2 rounded-lg shadow font-semibold text-white`}
                  onClick={() => {
                    setSelectedColor(color);
                    setSelectedSupply(null);
                  }}
                >
                  {color}
                </button>
              ))}
            </div>
            <div className="text-center mt-6">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg shadow font-semibold"
                onClick={() => setSelectedDispenser(null)}
              >
                🔙 Voltar aos Dispensers
              </button>
            </div>
          </>
        )}

        {selectedDispenser && selectedColor && selectedDispenser.supplies.length > 0 && !selectedSupply && (
          <>
            <h2 className="text-2xl font-bold text-center mb-4">Selecionar Refil</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {selectedDispenser.supplies.map((supply) => (
                <div
                  key={supply.code}
                  className={`border rounded-xl p-4 cursor-pointer hover:shadow-lg transition bg-white`}
                  onClick={() => setSelectedSupply(supply)}
                >
                  <div className="relative w-full h-40 mb-3">
                    <Image
                      src={supply.imageURLsByColor[selectedColor] || supply.imageURL}
                      alt={supply.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h2 className="font-bold text-lg text-center text-gray-800">
                    {supply.name}
                  </h2>
                  <p className="text-sm text-center text-gray-500">
                    {supply.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg shadow font-semibold"
                onClick={() => setSelectedColor(null)}
              >
                🔙 Voltar às Cores
              </button>
            </div>
          </>
        )}

        {selectedDispenser && selectedColor && selectedSupply && (
          <div className="space-y-6 mt-10">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Digite o preço unitário
              </h2>
            </div>
            <input
              type="text"
              placeholder="Preço unitário"
              className="border px-4 py-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              value={price}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "").replace(/^0+/, "");
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
                onClick={() => setSelectedSupply(null)}
              >
                🔙 Voltar ao Refil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}