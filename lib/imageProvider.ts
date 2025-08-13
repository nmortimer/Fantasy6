import type { Team } from './utils';

export type ProviderResponse = { url: string };

export interface ImageProvider {
  generate(team: Team): Promise<ProviderResponse>;
}

/** Placeholder provider for local dev / no API key */
class PlaceholderProvider implements ImageProvider {
  async generate(team: Team) {
    const svg = encodeURIComponent(`
      <svg xmlns='http://www.w3.org/2000/svg' width='1024' height='1024' viewBox='0 0 1024 1024'>
        <rect width='1024' height='1024' fill='${team.secondary}'/>
        <circle cx='512' cy='512' r='360' fill='${team.primary}' opacity='0.95'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
          font-size='72' font-family='Inter, Arial, sans-serif' fill='#111'>
          ${team.mascot.slice(0,18)}
        </text>
      </svg>
    `);
    return { url: `data:image/svg+xml;charset=utf-8,${svg}` };
  }
}

/** OpenAI provider - easy to swap out later */
class OpenAIProvider implements ImageProvider {
  constructor(private apiKey: string){}
  async generate(team: Team) {
    const prompt = [
      `Create a clean, modern sports logo for a fantasy football team.`,
      `Team: ${team.name}. Mascot: ${team.mascot}.`,
      `Primary ${team.primary}, Secondary ${team.secondary}.`,
      `Vector style, bold lines, no text, transparent bg. Seed ${team.seed}.`
    ].join(' ');

    const res = await fetch('https://api.openai.com/v1/images', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-image-1',
        prompt,
        size: '1024x1024',
        n: 1,
        background: 'transparent'
      })
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI error: ${res.status} ${err}`);
    }
    const json = await res.json();
    const url = json?.data?.[0]?.url || json?.data?.[0]?.b64_json
      ? `data:image/png;base64,${json.data[0].b64_json}`
      : '';

    if (!url) throw new Error('No image url returned');
    return { url };
  }
}

export function getProvider(): ImageProvider {
  const key = process.env.OPENAI_API_KEY;
  if (key) return new OpenAIProvider(key);
  return new PlaceholderProvider();
}
