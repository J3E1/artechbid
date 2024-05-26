import AuctionNav from '@/components/auction-nav';
import ProductCard from '@/components/product-card';
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

export default function MyAuctions() {
	return (
		<>
			<AuctionNav links={links} type='my' />
			<div className='grid grid-cols-3 gap-3 grid-rows-6'>
				<ProductCard />
				<ProductCard />
				<ProductCard />
				<ProductCard />
				<ProductCard />
				<ProductCard />
				<ProductCard />
				<ProductCard />
				<ProductCard />
			</div>
		</>
	);
}
