import Link from "next/link";

export default function ConfirmarCompraNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Link inválido</h1>
        <p className="text-gray-500 mb-6">
          Este link pode estar incorreto ou a compra já foi confirmada.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-xl bg-presentix-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-presentix-800 transition"
        >
          Voltar ao início
        </Link>
      </div>
    </div>
  );
}
