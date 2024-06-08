import Timer from '@/components/timer';
import BidOn from '@/components/ui/bid-on';
import { getArtworkById } from '@/lib/utils';
import { Minus, MoveUpRight, Plus } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Artwork | artechbid',
};
export default async function ItemPage({
	params,
	searchParams,
}: {
	params: { id: string };
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	const artwork = await getArtworkById(params.id);

	return (
		<div className='grid grid-cols-7 my-2'>
			<div className='col-span-7 lg:col-span-4 bg-white/10 relative rounded-sm p-6'>
				<div className='absolute top-[14%] left-[14%] w-3/4 h-3/4 bg-black rounded-full opacity-70 mix-blend-multiply filter blur-3xl animate-blob'></div>

				<div className='h-full flex-1'>
					<div className='relative flex justify-center items-center h-full w-full'>
						<img
							src={artwork.imageUrl}
							className='w-2/4 shadow-2xl shadow-background object-contain'
						/>
					</div>
				</div>
			</div>
			<div className='col-span-7 lg:col-span-3 px-16 py-8'>
				<div>
					<h6 className='font-helvetica text-2xl leading-6'>{artwork.name}</h6>
					<h6 className='font-light text-md text-blue-600'>
						@{artwork.username}
					</h6>
				</div>
				
				<Timer artwork={artwork} />

				<BidOn artwork={artwork} />
			</div>
		</div>
	);
}
