interface EventStatsSummaryProps {
  totalValue: number;
  compradoValue: number;
  totalItems: number;
  compradoCount: number;
  disponivelCount: number;
}

export function EventStatsSummary({
  totalValue,
  compradoValue,
  totalItems,
  compradoCount,
  disponivelCount,
}: EventStatsSummaryProps) {
  const restante = totalValue - compradoValue;
  const progressPercent = totalValue > 0 ? Math.round((compradoValue / totalValue) * 100) : 0;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-2xl font-bold text-gray-800">R$ {totalValue.toFixed(2)}</p>
        <p className="text-xs text-gray-500 mt-1">Total da lista</p>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-2xl font-bold text-green-600">R$ {compradoValue.toFixed(2)}</p>
        <p className="text-xs text-gray-500 mt-1">Comprado</p>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-2xl font-bold text-primary-500">R$ {restante.toFixed(2)}</p>
        <p className="text-xs text-gray-500 mt-1">Restante</p>
      </div>
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <p className="text-2xl font-bold text-primary-600">{progressPercent}%</p>
        <p className="text-xs text-gray-500 mt-1">
          {compradoCount}/{totalItems} itens comprados
        </p>
      </div>
    </div>
  );
}
