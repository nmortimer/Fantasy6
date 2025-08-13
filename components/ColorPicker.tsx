import { useState, useEffect } from 'react';
import { sanitizeHex } from '@/lib/utils';

type Props = {
  label: string;
  value: string;
  onChange: (hex: string) => void;
};

export default function ColorPicker({ label, value, onChange }: Props){
  const [hex, setHex] = useState(value);

  useEffect(()=> setHex(value), [value]);

  function handleHex(v: string){
    const clean = sanitizeHex(v);
    setHex(clean);
    onChange(clean);
  }

  return (
    <div className="field">
      <label>{label}</label>
      <div className="colorRow">
        <div className="swatch" style={{background: hex}}/>
        <input
          type="color"
          aria-label={label}
          value={hex}
          onChange={(e)=> handleHex(e.target.value)}
          style={{ width: 44, height: 32, background: 'transparent', border: '1px solid var(--border)', borderRadius: 8 }}
        />
        <input
          className="hexInput"
          type="text"
          value={hex}
          onChange={(e)=> handleHex(e.target.value)}
          placeholder="#00B2CA"
        />
      </div>
    </div>
  );
}
