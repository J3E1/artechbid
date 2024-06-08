import { auth } from '@/auth';
import AuctionNav from '@/components/auction-nav';
import NoArtworks from '@/components/no-artworks';
import ProductCard from '@/components/product-card';
import { getUserArtWorks } from '@/lib/utils';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
const links = [
	{
		title: 'All',
		type: 'all',
	},
	{
		title: 'Live',
		type: '',
	},
	{
		title: 'Ended',
		type: 'ended',
	},
];

export const metadata: Metadata = {
	title: 'My Artworks | artechbid',
};

export default async function MyAuctions({
	searchParams,
}: {
	searchParams?: { type: 'ended' | 'live' | undefined };
}) {
	const session = await auth();

	if (!session) {
		return redirect('/sign-in');
	}

	const type = searchParams?.type || 'live';
	const artworks = await getUserArtWorks(session?.user?.id as string, type);

	return (
		<>
			<AuctionNav links={links} type='my' />
			{artworks.length ? (
				<div className='grid grid-cols-3 gap-3 grid-rows-6'>
					{artworks.map((artwork, i) => (
						<ProductCard
							key={artwork.id}
							artwork={artwork}
							ended={type === 'ended'}
						/>
					))}
				</div>
			) : (
				<NoArtworks />
			)}
		</>
	);
}
