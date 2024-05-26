'use client';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
type Props = {
	links: { title: string; type: string }[];
	type: 'my' | 'all';
};

export default function AuctionNav({ links,type }: Props) {
	const params = useSearchParams();
	const typeParam = params.get('type');

	return (
		<div className='my-8 border-b border-foreground/60 flex justify-center'>
			<div className='font-matrice text-3xl space-x-8 my-4'>
				{links?.map(link => (
					<Link
						href={link.type ? `?type=${link.type}` : type==='all'?'/auctions':'/auctions/my'}
						className={cn(
							'transition-colors hover:text-foreground/80',
							typeParam === link.type
								? 'text-foreground'
								: !link.type && !typeParam
								? 'text-foreground'
								: 'text-foreground/30'
						)}>
						{link.title}
					</Link>
				))}
			</div>
		</div>
	);
}
