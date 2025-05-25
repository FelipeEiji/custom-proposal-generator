'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 bg-gradient-to-b from-blue-50 to-white text-center">
      <div className="bg-white shadow-xl rounded-lg p-10 max-w-md w-full flex flex-col items-center">
        <Image
          src="/tap_logo.png"
          alt="TAP Logo"
          width={100}
          height={100}
          className="mb-6"
        />
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
          Bem-vindo ao <span className="text-blue-600">Gerador de Propostas</span>
        </h1>
        <p className="text-gray-600 mb-6">
          Crie propostas personalizadas para seus clientes de forma rápida e visual.
        </p>
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 px-6 rounded-lg shadow-md"
          onClick={() => router.push('/builder')}
        >
          Iniciar Proposta
        </button>
      </div>
    </div>
  );
}