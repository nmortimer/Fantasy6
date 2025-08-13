export type Team = {
  id: string;
  name: string;
  owner: string;
  mascot: string;
  primary: string;
  secondary: string;
  seed: number;
  logoUrl?: string | null;
};

export function randomSeed(): number {
  return Math.floor(Math.random() * 1_000_000_000);
}

// Simple color suggestion logic using mascot + team name hash
export function colorsFor(name: string, mascot: string, seed?: number) {
  const text = `${name}-${mascot}-${seed ?? 0}`.toLowerCase();
  const h = hash(text);
  const hueA = (h % 360 + 360) % 360;
  const hueB = ((h >> 8) % 360 + 360) % 360;
  const primary = hslToHex(hueA, 70, 55);
  const secondary = hslToHex(hueB, 40, 35);
  return { primary, secondary };
}

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return h >>> 0;
}

function hslToHex(h:number, s:number, l:number){
  s/=100; l/=100;
  const c = (1 - Math.abs(2*l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c/2;
  let r=0,g=0,b=0;
  if (0<=h && h<60){r=c;g=x;b=0}
  else if (60<=h && h<120){r=x;g=c;b=0}
  else if (120<=h && h<180){r=0;g=c;b=x}
  else if (180<=h && h<240){r=0;g=x;b=c}
  else if (240<=h && h<300){r=x;g=0;b=c}
  else {r=c;g=0;b=x}
  const toHex = (v:number)=>{
    const hv = Math.round((v+m)*255).toString(16).padStart(2,'0');
    return hv;
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function sanitizeHex(input: string) {
  const x = input.trim().replace(/[^0-9a-fA-F]/g, '').slice(0,6);
  return `#${x.padEnd(6,'0')}`;
}

export function promptFor(team: Team) {
  // A clean, deterministic prompt that works across providers
  return [
    `Create a clean, modern sports logo for a fantasy football team.`,
    `Team name: ${team.name}. Mascot: ${team.mascot}.`,
    `Primary color: ${team.primary}. Secondary color: ${team.secondary}.`,
    `Style: bold lines, vector, centered emblem, transparent background, no text.`,
    `Seed: ${team.seed}.`,
  ].join(' ');
}
