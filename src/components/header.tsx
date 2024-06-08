'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { UserRound, Bell, Circle, Dot } from 'lucide-react';
import { Button } from './ui/button';
import { signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import Notifications from './notifications';

const notifications = [
	{
		title: 'Your call has been confirmed.',
		description: '1 hour ago',
	},
	{
		title: 'You have a new message!',
		description: '1 hour ago',
	},
	{
		title: 'Your subscription is expiring soon!',
		description: '2 hours ago',
	},
];
export default function Header() {
	const [isLoggingOut, setIsLoggingOut] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const session = useSession();

	const isAuthenticated = session.status === 'authenticated';

	const logout = async () => {
		setIsLoggingOut(true);
		await signOut({ redirect: false });
		router.replace('/auctions');
		setIsLoggingOut(false);
	};

	return (
		<header className='sticky top-0 z-50 w-full bg-background/95 backdrop-blur-3xl supports-[backdrop-filter]:bg-background/60 py-6'>
			<div className='container flex max-w-screen-2xl items-center'>
				<div className='flex flex-1 justify-between'>
					<Link className='mr-6 flex items-center space-x-2 min-w-24' href='/'>
						<span className='font-matrice inline-block'>
							artechbid
							<span className='text-blue-600'> .</span>
						</span>
					</Link>
					<nav className='hidden md:flex items-center gap-4 text-sm lg:gap-6 font-light mx-auto'>
						{isAuthenticated && (
							<>
								<Link
									href='/auctions'
									className={cn(
										'transition-colors hover:text-foreground/80',
										pathname === '/auctions'
											? 'text-foreground'
											: 'text-foreground/60'
									)}>
									Auctions
								</Link>
								<Link
									href='/auctions/my'
									className={cn(
										'transition-colors hover:text-foreground/80',
										pathname === '/auctions/my'
											? 'text-foreground'
											: 'text-foreground/60'
									)}>
									My Auctions
								</Link>
								<Link
									href='/auctions/create'
									className={cn(
										'transition-colors hover:text-foreground/80',
										pathname === '/auctions/create'
											? 'text-foreground'
											: 'text-foreground/60'
									)}>
									Create
								</Link>
							</>
						)}
					</nav>
					{isAuthenticated ? (
						<div className='min-w-24 flex justify-end items-center gap-4'>
							<Notifications />
							<Popover>
								<PopoverTrigger>
									<div className='cursor-pointer h-10 w-10 rounded-full border border-foreground/30 flex justify-center items-center'>
										<UserRound
											height={20}
											width={20}
											className='text-foreground/80'
										/>
									</div>
								</PopoverTrigger>
								<PopoverContent
									onClick={() => signOut({ redirect: false })}
									className='bg-background/95 backdrop-blur-3xl supports-[backdrop-filter]:bg-background/60 border-0'>
									<div className=''>
										<div className='text-center'>
											<p className='text-sm font-medium leading-none'>
												{session.data?.user?.name}
											</p>
											<p className='text-sm text-muted-foreground'>
												{session.data?.user?.email}
											</p>
											<Button
												className='mt-8'
												disabled={isLoggingOut}
												onClick={logout}
												variant={'destructive'}>
												Log out
											</Button>
										</div>
									</div>
								</PopoverContent>
							</Popover>
						</div>
					) : (
						<Button
							asChild
							className='bg-blue-600 hover:bg-blue-500 text-foreground'>
							<Link href='/sign-in'>Sign in</Link>
						</Button>
					)}
				</div>
			</div>
		</header>
	);
}
