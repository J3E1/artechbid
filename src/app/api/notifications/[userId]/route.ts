import { getArtworkById, getUserNotifications, markNotificationAsRead } from '@/lib/utils';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
	const userId = req.nextUrl.pathname.split('/').pop();

	if (!userId) return Response.json({ message: 'Invalid artwork ID' });

	const notifications = await getUserNotifications(userId);

	return Response.json({ notifications });
}
export async function POST(req: NextRequest) {
	const userId = req.nextUrl.pathname.split('/').pop();

	if (!userId) return Response.json({ message: 'Invalid artwork ID' });

	const body = await req.json();

	if (!body.notificationId) return Response.json({ message: 'Invalid notification ID' });
	const response = await markNotificationAsRead(
		userId,
		body.notificationId as string
	);

	return Response.json({ ...response });
}
