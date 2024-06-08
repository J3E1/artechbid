'use client';
import { useEffect, useState } from 'react';
import { Notification } from '../../typings';
import { useSession } from 'next-auth/react';
import { getRTUserNotifications, getUserNotifications } from '@/lib/utils';
import { PopoverTrigger, Popover, PopoverContent } from './ui/popover';
import { Bell, Dot } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Notifications() {
	const router = useRouter();

	const session = useSession();
	const userId = session.data?.user?.id;

	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	if (!userId) return null;

	useEffect(() => {
		async function getNotifications() {
			setIsLoading(true);
			const notifications: { notifications: Notification[] } = await fetch(
				`/api/notifications/${userId}`,
				{ cache: 'no-store' }
			).then(res => res.json());
			setNotifications(notifications.notifications);
			setIsLoading(false);
		}
		getNotifications();
	}, []);

	const readNotification = async (notification: Notification) => {
		try {
			const res = await fetch(`/api/notifications/${userId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ notificationId: notification.id }),
			});
			if (res.ok) {
				router.push(`/auctions/${notification.artworkId}`);
				setNotifications(
					notifications.filter(
						prevNotification => prevNotification.id !== notification.id
					)
				);
			}
		} catch (error) {
			console.error(error);
		}
	};
	return (
		<Popover>
			<PopoverTrigger>
				<div className='cursor-pointer relative h-10 w-10 rounded-full border border-foreground/30 flex justify-center items-center'>
					<Bell height={20} width={20} className='text-foreground/80' />
					{notifications.length > 0 && (
						<Dot
							height={50}
							width={50}
							className='text-blue-600 absolute -top-3 left-0'
						/>
					)}
				</div>
			</PopoverTrigger>
			<PopoverContent className='bg-background/95 backdrop-blur-3xl supports-[backdrop-filter]:bg-background/60 border-0 p-0'>
				{isLoading && <div className='text-foreground/80'>Loading...</div>}
				{notifications.map((notification, index) => (
					<div
						key={index}
						onClick={() => readNotification(notification)}
						className='grid grid-cols-[25px_1fr] items-start p-4 last:mb-0 hover:bg-background/80 hover:cursor-pointer transition-colors ease-in-out'>
						<span className='flex h-2 w-2 translate-y-1 rounded-full bg-blue-600' />
						<div className='space-y-1'>
							<p className='text-sm font-medium leading-none'>
								{notification.message}
							</p>
							<p className='text-xs text-gray-500'>
								{new Date(
									notification.timestamp?.seconds * 1000
								).toLocaleString()}
							</p>
						</div>
					</div>
				))}
			</PopoverContent>
		</Popover>
	);
}
