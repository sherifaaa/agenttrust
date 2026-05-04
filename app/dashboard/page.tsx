'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Dashboard() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAgentName, setNewAgentName] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  async function fetchAgents() {
    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      // Fetch reputation for each agent
      const agentsWithRep = await Promise.all(
        data.map(async (agent) => {
          const { data: rep } = await supabase
            .from('reputation_scores')
            .select('overall_score')
            .eq('agent_id', agent.id)
            .single();
          return { ...agent, reputation: rep?.overall_score || 50 };
        })
      );
      setAgents(agentsWithRep);
    }
    setLoading(false);
  }

  async function createAgent() {
    if (!newAgentName.trim()) return;
    setCreating(true);

    // Generate a temporary public key (in production, agents would provide their own)
    const tempPublicKey = `temp_key_${Date.now()}`;

    const response = await fetch('/api/agents/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newAgentName,
        owner_email: 'dashboard@agenttrust.com',
        public_key: tempPublicKey
      })
    });

    const data = await response.json();
    if (data.success) {
      alert(`Agent created! API Key: ${data.api_key}\nSave this key.`);
      setNewAgentName('');
      fetchAgents();
    } else {
      alert('Error creating agent: ' + data.error);
    }
    setCreating(false);
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Developer Dashboard</h1>

        {/* Create Agent Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Agent</h2>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Agent name"
              value={newAgentName}
              onChange={(e) => setNewAgentName(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={createAgent}
              disabled={creating || !newAgentName.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Agent'}
            </button>
          </div>
        </div>

        {/* Agents List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Your Agents</h2>
          </div>
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : agents.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No agents yet. Create your first agent above.
            </div>
          ) : (
            <div className="divide-y">
              {agents.map((agent) => (
                <div key={agent.id} className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{agent.name}</h3>
                      <p className="text-gray-500 text-sm">ID: {agent.id}</p>
                      <p className="text-gray-500 text-sm">
                        Verification: {agent.verification_level}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-blue-600">
                        {agent.reputation}/100
                      </div>
                      <p className="text-gray-500 text-sm">Reputation Score</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
