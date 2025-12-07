export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-8">HealthLife AI</h2>
        <nav className="space-y-2">
          <a href="/focus" className="block px-4 py-2 rounded hover:bg-gray-100 transition">
            🏠 Focus
          </a>
          <a href="/journey" className="block px-4 py-2 rounded hover:bg-gray-100 transition">
            🗺 Journey
          </a>
          <a href="/coach" className="block px-4 py-2 rounded hover:bg-gray-100 transition">
            🧠 AI Coach
          </a>
          <a href="/you" className="block px-4 py-2 rounded hover:bg-gray-100 transition">
            📊 You
          </a>
          <a href="/tribe" className="block px-4 py-2 rounded hover:bg-gray-100 transition">
            🔥 Tribe
          </a>

          <div className="border-t border-gray-200 my-4"></div>

          <a href="/components-demo" className="block px-4 py-2 rounded hover:bg-gray-100 transition text-gray-500 text-sm">
            🎨 UI Components
          </a>
        </nav>
      </aside>
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  );
}
