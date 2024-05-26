'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { UserRound, Bell, Circle, Dot } from 'lucide-react';

export default function Header() {
	const pathname = usePathname();
	return (
		<header className='sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-6'>
			<div className='container flex max-w-screen-2xl items-center'>
				<div className='hidden md:flex flex-1'>
					<Link className='mr-6 flex items-center space-x-2 min-w-24' href='/'>
						<span className='hidden font-matrice sm:inline-block'>
							artechbid
							<span className='text-blue-600'> .</span>
						</span>
					</Link>
					<nav className='flex items-center gap-4 text-sm lg:gap-6 font-light mx-auto'>
						<Link
							href='/'
							className={cn(
								'transition-colors hover:text-foreground/80',
								pathname === '/'
									? 'text-foreground'
									: 'text-foreground/60'
							)}>
							Home
						</Link>
						<Link
							href='/auctions'
							className={cn(
								'transition-colors hover:text-foreground/80',
								pathname === '/auctions' ? 'text-foreground' : 'text-foreground/60'
							)}>
							Auctions
						</Link>
						<Link
							href='/auctions/my'
							className={cn(
								'transition-colors hover:text-foreground/80',
								pathname === '/artists'
									? 'text-foreground'
									: 'text-foreground/60'
							)}>
							My Auctions
						</Link>
						<Link
							href='/auctions/create'
							className={cn(
								'transition-colors hover:text-foreground/80',
								pathname === '/collections'
									? 'text-foreground'
									: 'text-foreground/60'
							)}>
							Create
						</Link>
					</nav>
					<div className='min-w-24 flex justify-end items-center gap-4'>
						<Popover>
							<PopoverTrigger>
								<div className='cursor-pointer relative h-10 w-10 rounded-full border border-foreground/30 flex justify-center items-center'>
									<Bell height={20} width={20} className='text-foreground/80' />
									<Dot  height={50} width={50} className='text-blue-600 absolute -top-3 left-0' />
								</div>
							</PopoverTrigger>
							<PopoverContent className='bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-0'>
								Place content for the popover here.
							</PopoverContent>
						</Popover>
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
							<PopoverContent className='bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-0'>
								Place content for the popover here.
							</PopoverContent>
						</Popover>
					</div>
				</div>
			</div>
		</header>
	);
}
