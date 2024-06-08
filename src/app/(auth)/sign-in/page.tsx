'use client';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { LoginSchema, loginSchema } from '@/lib/schemas';
import Link from 'next/link';
import { login } from '@/lib/actions';
import { useState, useTransition } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function LoginForm() {
	// const [isPending, startTransition] = useTransition();
	const [isPending, setIsPending] = useState(false);
	const router = useRouter();
	const { toast } = useToast();
	const loginForm = useForm<LoginSchema>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});

	async function onSubmit(values: LoginSchema) {
		try {
			setIsPending(true);
			const res = await signIn('credentials', { ...values, redirect: false });
			if(res?.error === 'CredentialsSignin') {
				throw new Error('Invalid credentials.');
			}

			toast({
				title: 'Logged in successfully.',
				variant: 'success',
			});
			router.replace('/auctions');
			setIsPending(false);
		} catch (error) {
			if (error instanceof Error) {
				toast({
					title: error.message,
					variant: 'destructive',
				});
			}
			setIsPending(false);
		}
	}

	return (
		<Card className='mx-auto max-w-lg'>
			<CardHeader>
				<CardTitle className='text-3xl font-matrice-semibold'>Login</CardTitle>
				<CardDescription>
					Enter your email below to login to your account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...loginForm}>
					<form
						onSubmit={loginForm.handleSubmit(onSubmit)}
						className='grid gap-4'>
						<div className='grid gap-2'>
							<FormField
								control={loginForm.control}
								name='username'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='font-matrice-semibold'>Username</FormLabel>
										<FormControl>
											<Input
												className='bg-white/20'
												disabled={isPending}
												type='text'
												required
												placeholder='john123'
												{...field}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className='grid gap-2'>
							<FormField
								control={loginForm.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='font-matrice-semibold'>Password</FormLabel>
										<FormControl>
											<Input
												className='bg-white/20'
												disabled={isPending}
												type='password'
												required
												placeholder='********'
												{...field}
											/>
										</FormControl>

										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<Button
							disabled={isPending}
							type='submit'
							className='w-full bg-blue-600 hover:bg-blue-500 text-foreground font-matrice-semibold'>
							Login
						</Button>
						<Button disabled={isPending} variant='outline' className='w-full font-matrice-semibold'>
							Login with Google
						</Button>
					</form>
				</Form>
				<div className='mt-4 text-center text-sm'>
					Don&apos;t have an account?{' '}
					<Link href='/sign-up' className='underline'>
						Sign up
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
