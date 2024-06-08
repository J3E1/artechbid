import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from 'next-auth/react';
import { auth } from '@/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'artechbid',
	description: 'Online bidding platform for your artworks',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();
	return (
		<SessionProvider session={session}>
			<html lang='en'>
				<body
					className={`${inter.className} min-h-screen bg-background antialiased custom-scrollbar`}>
					<Header />
					<div className='container mx-auto'>{children}</div>
					<Toaster />
				</body>
			</html>
		</SessionProvider>
	);
}
