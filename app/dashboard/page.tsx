'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  async function fetchAgents() {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .limit(10);

    if (!error && data) {
      setAgents(data);
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Your Agents</h2>
            </div>
            <div className="divide-y">
              {agents.map((agent) => (
                <div key={agent.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{agent.name}</h3>
                      <p className="text-gray-500 text-sm">ID: {agent.id}</p>
                      <p className="text-gray-500 text-sm">Verification: {agent.verification_level}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {agent.reputation_scores?.overall_score || 50}/100
                      </div>
                      <p className="text-gray-500 text-sm">Reputation Score</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
