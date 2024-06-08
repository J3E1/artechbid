import { auth } from '@/auth';
import AuctionNav from '@/components/auction-nav';
import NoArtworks from '@/components/no-artworks';
import ProductList from '@/components/product-list';
import { getAllArtwork } from '@/lib/utils';
import { Metadata } from 'next';

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
	title: 'Artworks | artechbid',
};
export default async function HomePage({
	searchParams,
}: {
	searchParams?: { type: 'ended' | 'live' | undefined };
}) {
	const type = searchParams?.type || 'live';

	const artworks = await getAllArtwork(type);

	return (
		<>
			<AuctionNav links={links} type='all' />
			{artworks.length ? (
				<ProductList artworks={artworks} ended={type === 'ended'} />
			) : (
				<NoArtworks />
			)}
		</>
	);
}
