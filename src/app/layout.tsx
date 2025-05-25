import type { Metadata } from "next";
import "./globals.css";
import { ProposalProvider } from '../context/ProposalContext';

export const metadata: Metadata = {
  title: "Gerador de Propostas TAP",
  description: "Gerador de Propostas para produtos TORK da empresa TAP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body>
        <ProposalProvider>
          {children}
        </ProposalProvider>
      </body>
    </html>
  );
} 