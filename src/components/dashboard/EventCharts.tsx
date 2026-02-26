"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import type { GiftItem } from "@/types/database";

interface EventChartsProps {
  items: GiftItem[];
}

const PROGRESS_COLORS = ["#5B92EE", "#22c55e"]; // primary-600, green-500
const CATEGORY_COLORS = ["#5B92EE", "#9ABEF5", "#7AA8F2", "#B3CEF8"];

export function EventCharts({ items }: EventChartsProps) {
  const totalValue = items.reduce((acc, i) => acc + Number(i.price), 0);
  const compradoValue = items
    .filter((i) => i.status === "comprado")
    .reduce((acc, i) => acc + Number(i.price), 0);
  const restanteValue = totalValue - compradoValue;

  const progressData = [
    { name: "Comprado", value: compradoValue, color: PROGRESS_COLORS[1] },
    { name: "Restante", value: restanteValue, color: PROGRESS_COLORS[0] },
  ].filter((d) => d.value > 0);

  const categoryMap = new Map<string, number>();
  items
    .filter((i) => i.status === "comprado")
    .forEach((i) => {
      const cat = i.category || "Outros";
      categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + 1);
    });
  const categoryData = Array.from(categoryMap.entries()).map(([name, count], idx) => ({
    name,
    count,
    fill: CATEGORY_COLORS[idx % CATEGORY_COLORS.length],
  }));

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
        <p className="text-sm text-gray-400 text-center">Adicione itens para ver os gráficos.</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 gap-6 mb-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Progresso da lista</h3>
        {progressData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={progressData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                label={({ name, value }) =>
                  totalValue > 0 ? `${name}: R$ ${value.toFixed(0)}` : ""
                }
              >
                {progressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`R$ ${value.toFixed(2)}`, ""]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">Nenhum dado de progresso ainda.</p>
        )}
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="font-semibold text-gray-800 mb-4">Comprados por categoria</h3>
        {categoryData.length > 0 ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryData} layout="vertical" margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis type="number" allowDecimals={false} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [value, "Itens"]} />
              <Bar dataKey="count" name="Itens" radius={[0, 4, 4, 0]} fill="#e11d48" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">
            Nenhum item comprado por categoria ainda.
          </p>
        )}
      </div>
    </div>
  );
}
