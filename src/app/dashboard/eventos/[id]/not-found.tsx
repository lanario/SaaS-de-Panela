import Link from "next/link";

export default function EventoNotFound() {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-bold text-gray-800 mb-2">Evento não encontrado</h2>
      <p className="text-gray-500 mb-4 text-sm">
        Este evento não existe ou você não tem permissão para acessá-lo.
      </p>
      <Link
        href="/dashboard"
        className="inline-flex items-center justify-center rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-600 transition"
      >
        Voltar ao dashboard
      </Link>
    </div>
  );
}
