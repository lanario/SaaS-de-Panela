const { useState } = React;

const mockItems = [
  { id: 1, name: "Jogo de Panelas Tramontina", link: "https://amazon.com.br/panelas", image: "https://placehold.co/200x200", price: 349.90, category: "Cozinha", status: "disponivel", buyer: null },
  { id: 2, name: "Liquidificador Philips Walita", link: "https://amazon.com.br/liquidificador", image: "https://placehold.co/200x200", price: 189.90, category: "Eletrodomésticos", status: "reservado", buyer: "Ana Paula" },
  { id: 3, name: "Jogo de Talheres 24 peças", link: "https://amazon.com.br/talheres", image: "https://placehold.co/200x200", price: 129.90, category: "Mesa Posta", status: "comprado", buyer: "Carlos Silva" },
  { id: 4, name: "Conjunto de Toalhas de Banho", link: "https://amazon.com.br/toalhas", image: "https://placehold.co/200x200", price: 89.90, category: "Cama/Banho", status: "disponivel", buyer: null },
  { id: 5, name: "Cafeteira Nespresso", link: "https://amazon.com.br/cafeteira", image: "https://placehold.co/200x200", price: 499.90, category: "Eletrodomésticos", status: "disponivel", buyer: null },
  { id: 6, name: "Jogo de Cama Queen 200 fios", link: "https://amazon.com.br/cama", image: "https://placehold.co/200x200", price: 219.90, category: "Cama/Banho", status: "comprado", buyer: "Fernanda Lima" },
];

const categories = ["Todos", "Cozinha", "Eletrodomésticos", "Mesa Posta", "Cama/Banho"];

const statusConfig = {
  disponivel: { label: "Disponível", color: "bg-green-100 text-green-700", dot: "bg-green-500" },
  reservado: { label: "Reservado", color: "bg-yellow-100 text-yellow-700", dot: "bg-yellow-500" },
  comprado: { label: "Comprado ✓", color: "bg-gray-100 text-gray-500", dot: "bg-gray-400" },
};

function PixModal({ item, onClose }) {
  const [copied, setCopied] = useState(false);
  const pixKey = "11999999999";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Enviar via Pix 💸</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
        </div>
        <div className="bg-pink-50 rounded-xl p-4 mb-4 text-center">
          <p className="text-sm text-gray-500 mb-1">Presente escolhido</p>
          <p className="font-semibold text-gray-800">{item.name}</p>
          <p className="text-2xl font-bold text-primary-600 mt-2">R$ {item.price.toFixed(2)}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-xs text-gray-500 mb-1">Chave Pix (Celular)</p>
          <div className="flex items-center justify-between">
            <span className="font-mono font-semibold text-gray-800">{pixKey}</span>
            <button
              onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }}
              className="text-xs bg-primary-500 text-white px-3 py-1 rounded-lg hover:bg-pink-600 transition"
            >
              {copied ? "Copiado!" : "Copiar"}
            </button>
          </div>
        </div>
        <div className="bg-gray-100 rounded-xl flex items-center justify-center h-32 mb-4">
          <div className="text-center text-gray-400">
            <div className="text-4xl mb-1">📱</div>
            <p className="text-xs">QR Code Pix aqui</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 text-center">Após o pagamento, o presente será marcado como comprado automaticamente.</p>
      </div>
    </div>
  );
}

function GiftModal({ onClose }) {
  const [url, setUrl] = useState("");
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Cozinha");

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Adicionar Presente 🎁</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">×</button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Nome do Produto</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Jogo de Panelas..." className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Link do Produto</label>
            <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://..." className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Valor (R$)</label>
            <input value={price} onChange={e => setPrice(e.target.value)} placeholder="0,00" type="number" className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Categoria</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300">
              {categories.filter(c => c !== "Todos").map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-50 transition">Cancelar</button>
          <button onClick={onClose} className="flex-1 bg-primary-500 text-white py-2 rounded-xl text-sm font-semibold hover:bg-pink-600 transition">Adicionar</button>
        </div>
      </div>
    </div>
  );
}

function GiftCard({ item, onPix }) {
  const st = statusConfig[item.status];
  const isAvailable = item.status === "disponivel";

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition hover:shadow-md ${!isAvailable ? "opacity-70" : ""}`}>
      <div className="relative">
        <img src={item.image} alt={item.name} className="w-full h-40 object-cover bg-gray-100" />
        <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${st.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`}></span>
          {st.label}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-pink-400 font-semibold uppercase mb-1">{item.category}</span>
        <h4 className="font-semibold text-gray-800 text-sm mb-1 leading-tight">{item.name}</h4>
        <p className="text-xl font-bold text-gray-900 mb-1">R$ {item.price.toFixed(2)}</p>
        {item.buyer && <p className="text-xs text-gray-400 mb-3">por {item.buyer}</p>}
        {!item.buyer && <div className="mb-3" />}
        <div className="mt-auto flex gap-2">
          {isAvailable ? (
            <>
              <a href={item.link} target="_blank" rel="noreferrer" className="flex-1 bg-primary-500 text-white text-xs font-semibold py-2 rounded-xl text-center hover:bg-pink-600 transition">
                🛒 Comprar
              </a>
              <button onClick={() => onPix(item)} className="flex-1 border border-pink-300 text-primary-500 text-xs font-semibold py-2 rounded-xl hover:bg-pink-50 transition">
                💸 Pix
              </button>
            </>
          ) : (
            <div className="flex-1 bg-gray-100 text-gray-400 text-xs font-semibold py-2 rounded-xl text-center cursor-not-allowed">
              {item.status === "reservado" ? "⏳ Reservado" : "✅ Já comprado"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [pixItem, setPixItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [view, setView] = useState("lista"); // lista | admin

  const total = mockItems.reduce((a, b) => a + b.price, 0);
  const comprados = mockItems.filter(i => i.status === "comprado").reduce((a, b) => a + b.price, 0);
  const disponiveis = mockItems.filter(i => i.status === "disponivel").length;

  const filtered = activeCategory === "Todos" ? mockItems : mockItems.filter(i => i.category === activeCategory);

  return (
    <div className="min-h-screen bg-primary-100 font-sans">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-primary-600">🍳 Lista de Presentes</h1>
            <p className="text-xs text-gray-400">Chá de Panela • Ana & Pedro</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setView(view === "lista" ? "admin" : "lista")}
              className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition ${view === "admin" ? "bg-primary-500 text-white" : "border border-primary-300 text-primary-600 hover:bg-primary-100"}`}
            >
              {view === "admin" ? "👁 Ver Lista" : "⚙️ Gerenciar"}
            </button>
            {view === "admin" && (
              <button onClick={() => setShowAddModal(true)} className="text-xs bg-green-500 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-green-600 transition">
                + Adicionar
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-primary-500">{mockItems.length}</p>
            <p className="text-xs text-gray-400 mt-1">Total de Itens</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-green-500">{mockItems.filter(i => i.status === "comprado").length}</p>
            <p className="text-xs text-gray-400 mt-1">Comprados</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-yellow-500">{disponiveis}</p>
            <p className="text-xs text-gray-400 mt-1">Disponíveis</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Progresso da Lista</span>
            <span className="text-sm font-bold text-primary-600">{Math.round((comprados / total) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary-400 to-primary-500 h-3 rounded-full transition-all"
              style={{ width: `${(comprados / total) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>R$ {comprados.toFixed(2)} arrecadados</span>
            <span>Meta: R$ {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Admin View */}
        {view === "admin" && (
          <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
            <h3 className="font-bold text-gray-700 mb-3">📋 Painel de Controle</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-400 border-b">
                    <th className="pb-2 pr-4">Produto</th>
                    <th className="pb-2 pr-4">Valor</th>
                    <th className="pb-2 pr-4">Status</th>
                    <th className="pb-2 pr-4">Comprador</th>
                    <th className="pb-2">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {mockItems.map(item => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-2 pr-4 font-medium text-gray-700 max-w-xs truncate">{item.name}</td>
                      <td className="py-2 pr-4 text-gray-600">R$ {item.price.toFixed(2)}</td>
                      <td className="py-2 pr-4">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${statusConfig[item.status].color}`}>
                          {statusConfig[item.status].label}
                        </span>
                      </td>
                      <td className="py-2 pr-4 text-gray-400 text-xs">{item.buyer || "—"}</td>
                      <td className="py-2">
                        <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-pink-300">
                          <option value="disponivel">Disponível</option>
                          <option value="reservado">Reservado</option>
                          <option value="comprado">Comprado</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap text-xs font-semibold px-4 py-2 rounded-full transition ${activeCategory === cat ? "bg-primary-500 text-white shadow-sm" : "bg-white text-gray-500 hover:bg-pink-50 border border-gray-100"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gift Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {filtered.map(item => (
            <GiftCard key={item.id} item={item} onPix={setPixItem} />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-8">
          🎉 Chá de Panela • 15 de Março de 2025 • Com muito amor ❤️
        </p>
      </div>

      {pixItem && <PixModal item={pixItem} onClose={() => setPixItem(null)} />}
      {showAddModal && <GiftModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}