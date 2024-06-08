import { Artwork } from '../../typings';
import ProductCard from './product-card';

type Props = { artworks: Artwork[]; ended?: boolean };
export default function ProductList({ artworks, ended }: Props) {
	return (
		<div className='grid grid-cols-3 gap-3 grid-rows-3 grid-flow-dense mb-16'>
			{artworks.map((artwork, i) => (
				<ProductCard
					key={artwork.id}
					artwork={artwork}
					full={i % 7 === 0}
					ended={ended}
				/>
			))}
		</div>
	);
}
