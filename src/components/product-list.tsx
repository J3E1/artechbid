import ProductCard from './product-card';

type Props = {};
export default function ProductList({}: Props) {
	return (
		<div className='grid grid-cols-3 gap-3 grid-rows-8'>
			<ProductCard full />
			<ProductCard ended/>
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard full />
			<ProductCard />
			<ProductCard />
			<ProductCard />
			<ProductCard />
		</div>
	);
}
