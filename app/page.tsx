export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            AgentTrust
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            The identity layer for the agent internet
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/dashboard"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Get Started
            </a>
            <a
              href="#"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50"
            >
              View Docs
            </a>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-8 mt-16 text-center">
          <div>
            <div className="text-3xl font-bold text-blue-600">0</div>
            <div className="text-gray-500">Agents</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">0</div>
            <div className="text-gray-500">Developers</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-600">0</div>
            <div className="text-gray-500">Frameworks</div>
          </div>
        </div>
      </div>
    </main>
  );
}
