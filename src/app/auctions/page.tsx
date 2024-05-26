import AuctionNav from '@/components/auction-nav';
import ProductList from '@/components/product-list';

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

export default function HomePage() {
	return (
		<>
			<AuctionNav links={links} type='all'/>
			<ProductList />
		</>
	);
}
