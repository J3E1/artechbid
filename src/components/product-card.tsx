import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Artwork } from '../../typings';

type Props = {
	artwork: Artwork;
	full?: boolean;
	ended?: boolean;
};
export default function ProductCard({ full, ended, artwork }: Props) {
	return (
		<>
			<div
				className={cn(
					'bg-white/10 relative min-h-80 rounded-sm p-6',
					full ? 'col-span-1 md:col-span-2 lg:row-span-2' :'col-span-1'
				)}>
				<div className='absolute top-[14%] left-[14%] w-3/4 h-3/4 bg-black rounded-full opacity-70 mix-blend-multiply filter blur-3xl animate-blob z-0'></div>

				<div className='h-full'>
					<div className='relative space-y-4 flex flex-col justify-between h-full'>
						<div className='flex-1 flex justify-center items-center'>
							<Link href={'/auctions/' + artwork.id}>
								<img
									src={artwork.imageUrl}
									className={cn(
										'cursor-pointer shadow-2xl shadow-background object-contain',
										full ? 'max-w-[13rem] md:max-w-[26rem]' : 'max-w-[13rem]'
									)}
								/>
							</Link>
						</div>
						<div className='flex justify-between items-end text-sm'>
							<div>
								<h6 className='font-matrice text-md'>{artwork.name}</h6>
								{artwork?.username ? (
									<h6 className='text-foreground/80 font-light'>
										@{artwork.username}
									</h6>
								) : null}
							</div>
							<div>
								{ended ? (
									<span className='text-red-600 font-matrice text-md'>
										Ended
									</span>
								) : (
									<span className='text-foreground/80 font-light'>
										${artwork.highestBid} |{' '}
										{new Date(
											artwork.endsAt?.seconds * 1000
										).toLocaleDateString('en-GB', { timeZone: 'UTC' })}
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
