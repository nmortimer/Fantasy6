import { useMemo, useState } from 'react';
import ColorPicker from './ColorPicker';
import Modal from './Modal';
import { Team, colorsFor, randomSeed } from '@/lib/utils';

type Props = {
  team: Team;
  onUpdate: (patch: Partial<Team>) => void;
  onGenerate: () => Promise<void>;
};

export default function TeamCard({ team, onUpdate, onGenerate }: Props){
  const [open, setOpen] = useState(false);
  const suggested = useMemo(() => colorsFor(team.name, team.mascot, team.seed), [team.name, team.mascot, team.seed]);
  const [busy, setBusy] = useState(false);

  async function doGenerate(){
    try{
      setBusy(true);
      await onGenerate();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card">
      <div className="cardHeader">
        <div style={{minWidth:0}}>
          <div className="cardTitle">{team.name}</div>
          <div className="cardSub">Owner: {team.owner}</div>
        </div>
        <button className="ghost small" onClick={()=> onUpdate({ seed: randomSeed() })}>New Seed</button>
      </div>

      <div className="cardBody">
        <div className="previewWrap" onClick={()=> team.logoUrl && setOpen(true)}>
          {team.logoUrl ? (
            <img src={team.logoUrl} alt={`${team.name} logo`} />
          ) : (
            <div className="help">No logo yet. Generate one!</div>
          )}
          <div className="previewHint">{team.logoUrl ? 'Click to open' : ' '}</div>
        </div>

        <div className="controls">
          <div className="field">
            <label>Mascot</label>
            <input className="input" type="text" value={team.mascot} onChange={(e)=> onUpdate({ mascot: e.target.value })} />
          </div>

          <ColorPicker label="Primary" value={team.primary} onChange={(hex)=> onUpdate({ primary: hex })} />
          <ColorPicker label="Secondary" value={team.secondary} onChange={(hex)=> onUpdate({ secondary: hex })} />

          <div className="row small">
            <span>Suggested</span>
            <div className="swatch" style={{background:suggested.primary}}/>
            <div className="swatch" style={{background:suggested.secondary}}/>
            <button className="ghost small" onClick={()=> onUpdate({ primary: suggested.primary, secondary: suggested.secondary })}>
              Use Suggestions
            </button>
          </div>

          <div className="seedRow">
            <label className="small" style={{minWidth:64}}>Seed</label>
            <input
              className="input seedInput"
              type="number"
              value={team.seed}
              onChange={(e)=> onUpdate({ seed: parseInt(e.target.value || '0', 10) })}
            />
          </div>

          <div className="actions">
            <button className="primary" onClick={doGenerate} disabled={busy}>
              {busy ? 'Generating…' : 'Generate Logo'}
            </button>
            <button className="ghost" onClick={()=> onUpdate({ primary: suggested.primary, secondary: suggested.secondary })}>
              Remix Colors
            </button>
          </div>
        </div>
      </div>

      <div className="footerNote">Everything stays inside this card. No overflow. ✨</div>

      <Modal open={open} onClose={()=>setOpen(false)} title={team.name}>
        {team.logoUrl && <img className="modalImg" src={team.logoUrl} alt={`${team.name} logo full`} />}
      </Modal>
    </div>
  );
}
