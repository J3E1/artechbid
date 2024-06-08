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
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { register } from '@/lib/actions';
import { RegisterSchema, registerSchema } from '@/lib/schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { redirect, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

export default function RegisterForm() {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const { toast } = useToast();
	const registerForm = useForm<RegisterSchema>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			email: '',
			password: '',
			username: '',
		},
	});

	function onSubmit(values: RegisterSchema) {
		startTransition(() => {
			register(values).then(data => {
				if (data?.error) {
					return toast({
						title: data.error,
						variant: 'destructive',
					});
				}
				if (data?.success) {
					signIn('credentials', {
						...values,
						redirect: false,
					}).then(res => {
						if (res?.error === 'CredentialsSignin') {
							throw new Error('Invalid credentials.');
						}
					});

					toast({
						title: data.success,
						variant: 'success',
					});
					router.replace('/auctions');
					return;
				}
			});
		});
	}

	return (
		<Card className='mx-auto max-w-lg'>
			<CardHeader>
				<CardTitle className='text-3xl font-matrice-semibold'>
					Sign Up
				</CardTitle>
				<CardDescription>
					Enter your information to create an account
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...registerForm}>
					<form
						onSubmit={registerForm.handleSubmit(onSubmit)}
						className='grid gap-4'>
						<div className='grid gap-2'>
							<FormField
								control={registerForm.control}
								name='username'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='font-matrice-semibold'>
											Username
										</FormLabel>
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
								control={registerForm.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='font-matrice-semibold'>
											Email
										</FormLabel>
										<FormControl>
											<Input
												className='bg-white/20'
												disabled={isPending}
												type='email'
												required
												placeholder='john@doe.com'
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
								control={registerForm.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='font-matrice-semibold'>
											Password
										</FormLabel>
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
							Register
						</Button>
						<Button
							disabled={isPending}
							variant='outline'
							className='w-full font-matrice-semibold'>
							Signin with Google
						</Button>
					</form>
				</Form>
				<div className='mt-4 text-center text-sm'>
					Already have an account?{' '}
					<Link href='/sign-in' className='underline'>
						Sign in
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
