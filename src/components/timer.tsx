'use client';
import { calculateTimeLeft } from '@/lib/utils';
import { Timestamp } from 'firebase/firestore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Artwork } from '../../typings';

type Props = {
	artwork: Artwork;
};
export default function Timer({ artwork: { endsAt, createdAt } }: Props) {
	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endsAt));

	useEffect(() => {
		if (Object.values(calculateTimeLeft(endsAt)).every(val => val === 0)) {
			return;
		}

		const timer = setInterval(() => {
			setTimeLeft(calculateTimeLeft(endsAt));
		}, 1000);

		return () => clearInterval(timer);
	}, []);

	return (
		<>
			<div className='text-sm my-4 space-y-2'>
				<div className='w-full flex justify-center items-center font-helvetica'>
					<span className='block w-1/2 text-foreground/60'>
						Auction started at
					</span>
					<span className='block w-1/2'>
						{new Date(createdAt?.seconds * 1000).toLocaleDateString('en-GB', { timeZone: 'UTC' })}
					</span>
				</div>
			</div>
			<div className='flex justify-evenly items-center my-10'>
				<div className='flex flex-col justify-center items-center'>
					<span className='block font-helvetica text-2xl leading-6'>
						{String(timeLeft.days).padStart(2, '0')}
					</span>
					<span className='block text-foreground/60 text-sm font-helvetica'>
						Days
					</span>
				</div>
				<div className='flex flex-col justify-center items-center'>
					<span className='block font-helvetica text-2xl leading-6'>
						{String(timeLeft.hours).padStart(2, '0')}
					</span>
					<span className='block text-foreground/60 text-sm font-helvetica'>
						Hours
					</span>
				</div>
				<div className='flex flex-col justify-center items-center'>
					<span className='block font-helvetica text-2xl leading-6'>
						{String(timeLeft.minutes).padStart(2, '0')}
					</span>
					<span className='block text-foreground/60 text-sm font-helvetica'>
						Minutes
					</span>
				</div>
				<div className='flex flex-col justify-center items-center'>
					<span className='block font-helvetica text-2xl leading-6'>
						{String(timeLeft.seconds).padStart(2, '0')}
					</span>
					<span className='block text-foreground/60 text-sm font-helvetica'>
						Seconds
					</span>
				</div>
			</div>
		</>
	);
}
