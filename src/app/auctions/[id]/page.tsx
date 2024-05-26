import { Minus, MoveUpRight, Plus } from 'lucide-react';

export default function ItemPage() {
	return (
		<div className='grid grid-cols-7 my-2'>
			<div className='col-span-7 md:col-span-4 bg-white/10 relative rounded-sm p-6'>
				<div className='absolute top-[14%] left-[14%] w-3/4 h-3/4 bg-black rounded-full opacity-70 mix-blend-multiply filter blur-3xl animate-blob'></div>

				<div className='h-full flex-1'>
					<div className='relative flex justify-center items-center h-full w-full'>
						<img
							src='https://img.freepik.com/free-vector/watercolor-oil-painting-background_23-2150133488.jpg?w=740&t=st=1716484985~exp=1716485585~hmac=28bd9d6909990af8a2350ab8da735119826514e51675225533b100815f03d0b6'
							className='w-3/4 shadow-2xl shadow-background object-contain'
						/>
					</div>
				</div>
			</div>
			<div className='col-span-7 md:col-span-3 px-16 py-8'>
				<div>
					<h6 className='font-matrice text-2xl leading-6'>Neo Topical</h6>
					<h6 className='font-light text-md text-blue-600'>@testliciana</h6>
				</div>
				<div className='text-sm my-4 space-y-2'>
					<div className='w-full flex justify-center items-center'>
						<span className='block w-1/2 text-foreground/60'>Year</span>
						<span className='block w-1/2'>2006</span>
					</div>
				</div>
				<div className='flex justify-evenly items-center my-10'>
					<div className='flex flex-col justify-center items-center'>
						<span className='block font-matrice text-2xl leading-6'>05</span>
						<span className='block text-foreground/60 text-sm font-matrice-semibold'>
							Hours
						</span>
					</div>
					<div className='flex flex-col justify-center items-center'>
						<span className='block font-matrice text-2xl leading-6'>33</span>
						<span className='block text-foreground/60 text-sm font-matrice-semibold'>
							Minutes
						</span>
					</div>
					<div className='flex flex-col justify-center items-center'>
						<span className='block font-matrice text-2xl leading-6'>12</span>
						<span className='block text-foreground/60 text-sm font-matrice-semibold'>
							Seconds
						</span>
					</div>
				</div>
				<div className='flex justify-center items-center border-l-2 border-blue-600'>
					<div className='w-1/3 h-full text-xs text-foreground/60 ml-4'>
						15:146:17
					</div>
					<div className='w-2/3 py-2'>
						<span className='block text-xs text-foreground/60 mb-2'>
							Current bid
						</span>
						<span className='font-matrice text-2xl leading-6'>1.256</span>
						<span className='font-matrice text-md leading-6 text-foreground/60'>
							ETH
						</span>
						<span className='block text-xs text-foreground/60'>@fuji</span>
					</div>
				</div>
				<div className='flex justify-center items-center border-l-2 border-gray-300'>
					<div className='w-1/3 text-xs text-foreground/60 ml-4'>15:146:17</div>
					<div className='w-2/3 py-2'>
						<span className='font-matrice text-sm leading-6'>1.256</span>
						<span className='font-matrice text-xs leading-6 text-foreground/60'>
							ETH
						</span>
						<span className='block text-xs text-foreground/40'>@fuji</span>
					</div>
				</div>
				<div className='flex justify-center items-center border-l-2 border-gray-300'>
					<div className='w-1/3 text-xs text-foreground/60 ml-4'>15:146:17</div>
					<div className='w-2/3 py-2'>
						<span className='font-matrice text-sm leading-6'>1.256</span>
						<span className='font-matrice text-xs leading-6 text-foreground/60'>
							ETH
						</span>
						<span className='block text-xs text-foreground/40'>@fuji</span>
					</div>
				</div>
				<div className='text-center my-3 text-foreground/60 text-sm font-matrice-semibold'>
					Bid interval:{' '}
					<span className='text-foreground font-matrice'>1.0</span>ETH
				</div>
				<div className='flex bg-white/20 rounded-3xl'>
					<button className='bg-background text-blue-600 m-1 mr-0 px-3 rounded-l-full'>
						<Minus size={10} />
					</button>
					<button className='bg-background text-blue-600 m-1 px-3 rounded-r-full'>
						<Plus size={10} />
					</button>
					<div className='flex-1 mt-3 mb-1 text-center'>
						<span className='font-matrice text-2xl leading-6'>1.256</span>
						<span className='font-matrice text-md leading-6 text-foreground/60'>
							ETH
						</span>
					</div>
					<button className='bg-blue-600 rounded-full px-2'>
						<MoveUpRight />
					</button>
				</div>
			</div>
		</div>
	);
}
