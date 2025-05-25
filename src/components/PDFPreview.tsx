'use client';
import { useProposal } from '@/context/ProposalContext';

export default function PDFPreview() {
  const { items } = useProposal();
  if (!items.length) return null;

  // Paginate: 3 products per PDF sheet
  const pages = [];
  for (let i = 0; i < items.length; i += 3) pages.push(items.slice(i, i + 3));

  return (
    <div id="pdf-preview">
      {pages.map((pageItems, pageIdx) => (
        <div
          key={pageIdx}
          className="relative w-[210mm] h-[297mm] mx-auto bg-black-500 text-black px-[20mm] pt-[16mm] pb-[16mm] mb-8 last:mb-0"
        >
          <div className="flex flex-col h-full">
            <div className="flex-grow flex flex-col justify-between">
              {pageItems.map((item, idx) => {
                const imgRight = idx === 0 || idx === 2;
                const isLastItem = idx === pageItems.length - 1;
                const shouldShowDivider = !(isLastItem && pageItems.length === 3);

                return (
                  <div
                    key={item.code}
                    className={`flex ${imgRight ? 'flex-row-reverse' : 'flex-row'} gap-5 items-start pb-[6mm] ${
                      shouldShowDivider ? 'border-b border-black-300' : ''
                    }`}
                    style={{ minHeight: '75mm' }}
                  >
                    <img
                      src={item.imageURL}
                      alt={item.name}
                      className="w-[42mm] h-[75mm] object-cover object-center shrink-0"
                    />
                    <div className="flex-1 text-[11pt] leading-[1.25rem]">
                      <h2 className="text-[13pt] font-semibold mb-[2mm]">{item.name}</h2>
                      <p><span className="font-semibold">Descrição:</span> {item.description}</p>
                      <p><span className="font-semibold">Quantidade:</span> {item.quantity}</p>
                      <p><span className="font-semibold">Preço Unitário:</span> R$ {item.price.toFixed(2)} (CÓD. {item.code})</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer logo centered */}
            <footer className="mt-auto pt-[10mm] flex justify-center">
              <img src="/tap_logo.png" alt="Logo" className="w-[40mm] h-auto mx-auto" />
            </footer>
          </div>
        </div>
      ))}
    </div>
  );
}