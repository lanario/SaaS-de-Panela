import Link from "next/link";

export default function ListaNotFound() {
  return (
    <div className="min-h-screen bg-primary-100 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Lista não encontrada</h1>
        <p className="text-gray-500 mb-6">
          O link que você acessou pode estar incorreto ou a lista foi removida.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
