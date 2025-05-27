"use client";
import { ProposalItem } from "@/types/ProposalItem";
import { useProposal } from "@/context/ProposalContext";

export default function PDFPreview() {
  const { items } = useProposal();
  if (!items.length) return null;

  // Paginate: 3 products per PDF sheet
  const pages = [];
  for (let i = 0; i < items.length; i += 3) pages.push(items.slice(i, i + 3));

  return (
    <div id="pdf-preview" className="m-0 p-0">
      {pages.map((pageItems, pageIdx) => {
        const filledItems: (ProposalItem | null)[] = [...pageItems];
        while (filledItems.length < 3) filledItems.push(null);

        return (
          <div
            key={pageIdx}
            className="relative w-[794px] h-[1122px] mx-auto bg-white text-black px-[76px] pt-[61px] pb-[61px] overflow-hidden"
          >
            <div className="flex flex-col h-full justify-between">
              {filledItems.map((item, idx) => {
                if (!item) {
                  return (
                    <div
                      key={`empty-${idx}`}
                      style={{ minHeight: "283px" }}
                    ></div>
                  );
                }

                const imgRight = idx === 0 || idx === 2;
                const shouldShowDivider = idx < 2 && filledItems[idx + 1];

                return (
                  <div
                    key={item.name}
                    className={[
                      "flex",
                      imgRight ? "flex-row-reverse" : "flex-row",
                      "gap-5",
                      "items-start",
                      "pt-[23px]",
                      shouldShowDivider ? "border-b" : "",
                      shouldShowDivider ? "border-black-300" : "",
                    ].join(" ")}
                    style={{ minHeight: "283px" }}
                  >
                    {/* Image container */}
                    <div className="w-[159px] h-[283px] flex items-center justify-center shrink-0">
                      <img
                        src={item.imageURL}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>

                    {/* Text block */}
                    <div className="flex-1 text-[11pt] leading-[1.25rem] flex flex-col justify-between h-full pb-[12px]">
                      <div>
                        <h2 className="text-[13pt] font-semibold mb-[8px]">
                          {item.name}
                        </h2>
                        <p>
                          <span className="font-semibold">Descrição:</span>{" "}
                          {item.description}
                        </p>
                      </div>
                      <div>
                        <p>
                          <span className="font-semibold">Quantidade:</span>{" "}
                          {item.quantity}
                        </p>
                        <p>
                          <span className="font-semibold">Preço Unitário:</span>{" "}
                          R$ {item.price.toFixed(2)} (CÓD. {item.code})
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Footer logo */}
              <footer className="mt-auto pt-[38px] pb-0 flex justify-center bg-white">
                <img
                  src="/tap_logo.png"
                  alt="Logo"
                  className="w-[151px] h-auto mx-auto"
                />
              </footer>
            </div>
          </div>
        );
      })}
    </div>
  );
}