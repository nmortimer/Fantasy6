'use client';
import { useEffect, useMemo, useState } from 'react';
import TeamCard from '@/components/TeamCard';
import { Team, randomSeed } from '@/lib/utils';

type SleeperTeam = { team_id: string; display_name: string; owner_id: string };
type SleeperUser = { user_id: string; display_name: string };

export default function Home(){
  const [leagueId, setLeagueId] = useState('');
  const [loading, setLoading] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);

  async function loadLeague(){
    if(!leagueId) return;
    try{
      setLoading(true);
      // Sleeper API (public)
      const [rTeams, rUsers] = await Promise.all([
        fetch(`https://api.sleeper.app/v1/league/${leagueId}/rosters`),
        fetch(`https://api.sleeper.app/v1/league/${leagueId}/users`),
      ]);
      if(!rTeams.ok || !rUsers.ok) throw new Error('Failed to fetch league');
      const rosters = await rTeams.json();
      const users = await rUsers.json() as SleeperUser[];
      const userMap = new Map(users.map(u => [u.user_id, u.display_name]));

      const base: Team[] = (rosters as any[]).map((r, i) => ({
        id: String(r.roster_id ?? i),
        name: r.settings?.team_name || `Team ${i+1}`,
        owner: userMap.get(r.owner_id) || 'Unknown',
        mascot: 'Fox',
        primary: '#00B2CA',
        secondary: '#1A1A1A',
        seed: randomSeed(),
        logoUrl: null
      }));

      setTeams(base);
    } catch (e){
      alert((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function patchTeam(id: string, patch: Partial<Team>){
    setTeams(prev => prev.map(t => t.id === id ? { ...t, ...patch } : t));
  }

  async function generateLogo(team: Team){
    const res = await fetch('/api/generate-logo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team })
    });
    if(!res.ok){
      const err = await res.text();
      throw new Error(err);
    }
    const data = await res.json();
    patchTeam(team.id, { logoUrl: data.url });
  }

  const canRender = teams.length > 0;

  return (
    <div className="container">
      <div className="header">
        <h1>Fantasy Logo Studio</h1>
        <div className="tools">
          <input
            className="input"
            placeholder="Enter Sleeper League ID"
            value={leagueId}
            onChange={(e)=> setLeagueId(e.target.value)}
          />
          <button className="primary" onClick={loadLeague} disabled={loading}>
            {loading ? 'Loading…' : 'Load League'}
          </button>
        </div>
      </div>

      {!canRender && (
        <p className="help">Load a league to begin. We’ll create editable team cards. Click “Generate Logo” on any card.</p>
      )}

      {canRender && (
        <div className="grid">
          {teams.map(t => (
            <TeamCard
              key={t.id}
              team={t}
              onUpdate={(patch)=> patchTeam(t.id, patch)}
              onGenerate={()=> generateLogo(t)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
