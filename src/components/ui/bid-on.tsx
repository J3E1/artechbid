'use client';
import { AlertCircle, Circle, Minus, MoveUpRight, Plus } from 'lucide-react';
import { Artwork, Bid } from '../../../typings';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import { calculateTimeLeft, getArtworkById } from '@/lib/utils';
import { placeBidAction } from '@/lib/actions';
import { useToast } from './use-toast';
import { Alert, AlertDescription, AlertTitle } from './alert';

type Props = {
	artwork: Artwork & {
		username: string;
		bids: Bid[];
	};
};
export default function BidOn({ artwork }: Props) {
	const session = useSession();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(false);
	const [artworkData, setArtworkData] = useState(artwork);
	const [bidInterval, setBidInterval] = useState(5);

	const nextBid = useMemo(
		() =>
			artworkData.bids.length
				? artworkData.bids[0].amount + bidInterval
				: artworkData.startValue,
		[artworkData, bidInterval]
	);

	const handleBid = async () => {
		if (!session.data?.user?.id) {
			return;
		}

		try {
			setIsLoading(true);
			const res = await placeBidAction(
				artworkData.id,
				session.data.user.id,
				nextBid
			);
			if (res.success) {
				const updatedArtwork: {
					artwork: Artwork & { username: string; bids: Bid[] };
				} = await fetch(`/api/auctions/${artworkData.id}`, {
					cache: 'no-store',
				}).then(res => res.json());

				setArtworkData(updatedArtwork.artwork);
				toast({
					title: 'Bid placed',
					variant: 'success',
				});
			} else {
				toast({
					title: res.error,
					variant: 'destructive',
				});
			}
		} finally {
			setIsLoading(false);
		}
	};

	if (session.status !== 'authenticated') {
		return (
			<>
				<BidList bids={artworkData.bids} />
				<Alert variant='warning' className='text-center mt-4'>
					<AlertTitle>You need to be logged in</AlertTitle>
				</Alert>
			</>
		);
	}

	if (session.data?.user?.id === artworkData.userId)
		return (
			<>
				<BidList bids={artworkData.bids} />
				<Alert variant='warning' className='text-center mt-4'>
					<AlertTitle>You can not bid on your own artwork</AlertTitle>
				</Alert>
			</>
		);

	if (
		Object.values(calculateTimeLeft(artworkData.endsAt)).every(val => val === 0)
	) {
		return (
			<>
				<Alert variant='warning' className='text-center'>
					<AlertTitle>Auction ended</AlertTitle>
					<AlertDescription>
						This artwork has been sold to @{artworkData.bids[0].username} at $
						{artworkData.bids[0].amount}
					</AlertDescription>
				</Alert>
			</>
		);
	}

	return (
		<>
			<BidList bids={artworkData.bids} />
			<div className='text-center my-3 text-foreground/60 text-sm font-helvetica'>
				Bid interval: $
				<span className='text-foreground font-helvetica'>
					{String(bidInterval).padStart(2, '0')}
				</span>
			</div>
			<div className='flex bg-white/20 rounded-3xl'>
				<button
					disabled={bidInterval === 5}
					onClick={() => setBidInterval(prev => prev - 5)}
					className='bg-background text-blue-600 m-1 mr-0 px-3 rounded-l-full disabled:cursor-not-allowed'>
					<Minus size={10} />
				</button>
				<button
					disabled={bidInterval === 100 || !artworkData.bids.length}
					onClick={() => setBidInterval(prev => prev + 5)}
					className='bg-background text-blue-600 m-1 px-3 rounded-r-full disabled:cursor-not-allowed'>
					<Plus size={10} />
				</button>
				<div className='flex-1 mt-3 mb-1 text-center'>
					<span className='font-helvetica text-md leading-6 text-foreground/60'>
						$
					</span>
					<span className='font-helvetica text-2xl leading-6'>
						{nextBid.toFixed(2)}
					</span>
				</div>
				<button
					onClick={handleBid}
					disabled={session.data?.user?.id === artwork.userId || isLoading}
					className='bg-blue-600 hover:bg-blue-500 rounded-full px-2 disabled:cursor-not-allowed'>
					{!isLoading ? <MoveUpRight /> : <Circle />}
				</button>
			</div>
		</>
	);
}

function BidList({ bids }: { bids: Bid[] }) {
	if (!bids.length)
		return (
			<Alert variant='warning' className='text-center'>
				<AlertTitle>No bids yet</AlertTitle>
				<AlertDescription>Be the first to bid</AlertDescription>
			</Alert>
		);

	return (
		<>
			<div className='flex justify-center items-center border-l-2 border-blue-600'>
				<div className='w-1/3 h-full text-xs text-foreground/60 ml-4'>
					{new Date(bids.at(0)!.timestamp.seconds * 1000).toLocaleDateString('en-GB', { timeZone: 'UTC' })}
				</div>
				<div className='w-2/3 py-2'>
					<span className='block text-xs text-foreground/60 mb-2'>
						Current bid
					</span>
					<span className='font-helvetica text-md leading-6 text-foreground/60'>
						$
					</span>
					<span className='font-helvetica text-2xl leading-6'>
						{String(bids.at(0)?.amount).padStart(2, '0')}
					</span>
					<span className='block text-xs text-foreground/60'>
						@{bids[0].username}
					</span>
				</div>
			</div>
			{bids.slice(1).map((bid, i) => (
				<div
					key={i}
					className='flex justify-center items-center border-l-2 border-gray-300'>
					<div className='w-1/3 text-xs text-foreground/60 ml-4'>
						{new Date(bid.timestamp.seconds * 1000).toLocaleDateString('en-GB', { timeZone: 'UTC' })}
					</div>
					<div className='w-2/3 py-2'>
						<span className='font-helvetica text-xs leading-6 text-foreground/60'>
							$
						</span>
						<span className='font-helvetica text-sm leading-6'>
							{String(bid?.amount).padStart(2, '0')}
						</span>
						<span className='block text-xs text-foreground/40'>
							@{bid.username}
						</span>
					</div>
				</div>
			))}
		</>
	);
}
