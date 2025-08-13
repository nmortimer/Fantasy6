import type { NextApiRequest, NextApiResponse } from 'next';
import { getProvider } from '@/lib/imageProvider';
import { Team } from '@/lib/utils';
import { z } from 'zod';

const schema = z.object({
  team: z.object({
    id: z.string(),
    name: z.string(),
    owner: z.string(),
    mascot: z.string(),
    primary: z.string().regex(/^#?[0-9a-fA-F]{6}$/),
    secondary: z.string().regex(/^#?[0-9a-fA-F]{6}$/),
    seed: z.number(),
    logoUrl: z.string().nullable().optional()
  })
});

export default async function handler(req: NextApiRequest, res: NextApiResponse){
  if(req.method !== 'POST') return res.status(405).send('Method Not Allowed');
  try{
    const parsed = schema.parse(req.body);
    const team: Team = {
      ...parsed.team,
      primary: parsed.team.primary.startsWith('#') ? parsed.team.primary : `#${parsed.team.primary}`,
      secondary: parsed.team.secondary.startsWith('#') ? parsed.team.secondary : `#${parsed.team.secondary}`,
    };

    const provider = getProvider();
    const result = await provider.generate(team);
    return res.status(200).json({ url: result.url });
  } catch (e: any){
    return res.status(400).send(e.message ?? 'Bad Request');
  }
}
