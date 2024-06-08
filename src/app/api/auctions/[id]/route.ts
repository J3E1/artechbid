import { getArtworkById } from '@/lib/utils';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	const artworkId = req.nextUrl.pathname.split('/').pop();

	if (!artworkId) return Response.json({ message: 'Invalid artwork ID' });

	const artwork = await getArtworkById(artworkId);
	return Response.json({ artwork: artwork });
}
