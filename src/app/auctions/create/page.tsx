'use client';
import { ArtWorkSchema, artworkSchema } from '@/lib/schemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, CloudUpload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { useToast } from '@/components/ui/use-toast';
import { addArtwork } from '@/lib/actions';
import { Metadata } from 'next';
import { useRouter } from 'next/navigation';

const allowedTypes = ['image/jpeg', 'image/png'];
const maxFileSizeBytes = 4 * 1024 * 1024; // 4mb

export default function CreateAuction() {
	const router = useRouter();

	const [selectedImage, setSelectedImage] = useState<File | null>(null);
	const [isPending, startTransition] = useTransition();
	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		if (acceptedFiles.length > 0) {
			const image = acceptedFiles[0];
			setSelectedImage(image);
			// handleImageUpload(image);
		}
	}, []);
	const { getRootProps, getInputProps } = useDropzone({ onDrop });
	const form = useForm<ArtWorkSchema>({
		resolver: zodResolver(artworkSchema),
		defaultValues: {
			name: '',
			startValue: '' as unknown as number,
		},
	});
	const { toast } = useToast();

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		event.stopPropagation();
		if (event.target.files?.length) {
			const image = event.target.files[0];
			if (!allowedTypes.includes(image.type)) {
				return toast({
					title: 'Invalid image type.',
					description: 'jpeg and png are the valid image types.',
					variant: 'destructive',
				});
			}

			if (image.size > maxFileSizeBytes) {
				return toast({
					title: 'Exceed image size limit.',
					description: 'Image should be less than 4MB.',
					variant: 'destructive',
				});
			}
			setSelectedImage(image);
		}
	};

	function onSubmit(values: ArtWorkSchema) {
		if (!selectedImage) {
			return toast({
				title: 'Please select an artwork.',
				variant: 'destructive',
			});
		}
		const artworkData = new FormData();
		artworkData.append('name', values.name);
		artworkData.append('startValue', values.startValue.toString());
		artworkData.append('image', selectedImage);
		artworkData.append('endsAt', format(new Date(values.endsAt), 'yyyy-MM-dd'));

		startTransition(() => {
			addArtwork(artworkData).then(res => {
				if (res?.error) {
					return toast({
						title: res.error,
						variant: 'destructive',
					});
				}
				if (res?.success) {
					toast({
						title: res?.success,
						variant: 'success',
					});
					form.reset();
					router.push('/auctions/' + res.id);
				}
			});
		});
	}
	return (
		<div className='mt-2 mb-4'>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='grid grid-cols-2 gap-8'>
					<div {...getRootProps()} className='h-full col-span-2 md:col-span-1'>
						<label
							htmlFor='dropzone-file'
							className='relative flex flex-col items-center justify-center p-6 border-2 border-gray-300/50 border-dashed rounded-lg cursor-pointer w-full visually-hidden-focusable min-h-96'>
							{!selectedImage && (
								<div className='text-center'>
									<div className='border p-2 rounded-md max-w-min mx-auto'>
										<CloudUpload size={30} />
									</div>

									<p className='mt-2 text-sm text-gray-500'>
										<span className='font-semibold'>Drag an image</span>
									</p>
									<p className='text-xs text-gray-400'>
										Select a image or drag here
									</p>
								</div>
							)}
							{selectedImage instanceof File && (
								<div className='text-center space-y-2'>
									<Image
										width={1000}
										height={1000}
										src={URL.createObjectURL(selectedImage)}
										className='w-full object-contain min-h-56 opacity-70'
										alt='uploaded image'
									/>
									<div className='space-y-1'>
										<p className='text-sm font-semibold'>Selected Image</p>
										<p className='text-xs text-gray-400'>
											Click here to select another image
										</p>
									</div>
								</div>
							)}
						</label>
						<Input
							{...getInputProps()}
							id='dropzone-file'
							accept='image/png, image/jpeg'
							type='file'
							className='hidden'
							disabled={isPending}
							// disabled={loading || uploadedImagePath !== null}
							onChange={handleImageChange}
						/>
					</div>
					<div className='my-auto col-span-2 md:col-span-1'>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem className=''>
									<FormLabel className='font-matrice-semibold'>Name</FormLabel>
									<FormControl>
										<Input
											className='bg-white/20'
											title='Name of the artwork'
											disabled={isPending}
											required
											placeholder='Name of the artwork'
											{...field}
										/>
									</FormControl>

									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='startValue'
							render={({ field }) => (
								<FormItem className='mt-4'>
									<FormLabel className='font-matrice-semibold'>
										Start bid
									</FormLabel>
									<FormControl>
										<Input
											className='bg-white/20'
											placeholder='Starting bit at'
											title='Starting bit at'
											type='number'
											disabled={isPending}
											{...field}
											onChange={event =>
												field.onChange(Number(event.target.value))
											}
										/>
									</FormControl>
									<FormMessage className='text-red-600 mx-4' />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='endsAt'
							render={({ field }) => (
								<FormItem className='mt-4'>
									<FormLabel className='font-matrice-semibold'>
										Big end date
									</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													title='Big ends at'
													disabled={isPending}
													variant={'outline'}
													className={cn(
														'w-full text-left font-normal bg-white/20',
														!field.value && 'text-muted-foreground'
													)}>
													{field.value ? (
														format(field.value, 'PPP')
													) : (
														<span>Bid ends at</span>
													)}
													<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent
											className='w-auto p-0 bg-background/95 backdrop-blur-3xl supports-[backdrop-filter]:bg-background/60 border-0'
											align='start'>
											<Calendar
												mode='single'
												selected={field.value}
												onSelect={field.onChange}
												disabled={date => date < new Date()}
												initialFocus
											/>
										</PopoverContent>
									</Popover>
									<FormMessage className='text-red-600 mx-4' />
								</FormItem>
							)}
						/>
						<Button
							disabled={isPending}
							className='bg-blue-600 font-normal text-foreground hover:bg-blue-700 w-full mt-8'
							type='submit'>
							Submit
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
