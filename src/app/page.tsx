import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-primary-600 mb-2">
          🍳 Chá de Panela
        </h1>
        <p className="text-gray-600 mb-8">
          Crie e gerencie sua lista de presentes com facilidade.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition"
          >
            Entrar
          </Link>
          <Link
            href="/registro"
            className="inline-flex items-center justify-center rounded-xl border border-primary-300 text-primary-600 px-5 py-2.5 text-sm font-semibold hover:bg-primary-100 transition"
          >
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}
