import { cn } from '@/lib/utils';
import Link from 'next/link';

type Props = {
	full?: boolean;
	ended?: boolean;
};
export default function ProductCard({ full, ended }: Props) {
	return (
		<>
			<div
				className={cn(
					'bg-white/10 relative min-h-80 rounded-sm p-6',
					full && 'col-span-2 row-span-2'
				)}>
				<div className='absolute top-[14%] left-[14%] w-3/4 h-3/4 bg-black rounded-full opacity-70 mix-blend-multiply filter blur-3xl animate-blob z-0'></div>

				<div className='h-full'>
					<div className='relative space-y-4 flex flex-col justify-between h-full'>
						<div className='flex-1 flex justify-center items-center'>
							<Link href='/auctions/1'>
								<img
									src='https://img.freepik.com/free-vector/watercolor-oil-painting-background_23-2150133488.jpg?w=740&t=st=1716484985~exp=1716485585~hmac=28bd9d6909990af8a2350ab8da735119826514e51675225533b100815f03d0b6'
									className={cn(
										'cursor-pointer shadow-2xl shadow-background object-contain',
										full ? 'max-w-[26rem]' : 'max-w-[13rem]'
									)}
								/>
							</Link>
						</div>
						<div className='flex justify-between items-end text-sm'>
							<div>
								<h6 className='font-matrice text-md'>Neo Topical</h6>
								<h6 className='text-foreground/80 font-light'>@testliciana</h6>
							</div>
							<div>
								{ended ? (
									<span className='text-red-600 font-matrice text-md'>
										Ended
									</span>
								) : (
									<span className='text-foreground/80 font-light'>
										2,000 $ / 15:00:00
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
