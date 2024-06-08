import NextAuth, { DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { loginSchema } from './lib/schemas';
import { usersRef } from './lib/firebase';
import { doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import bcrypt from 'bcrypt';

export const { handlers, signIn, signOut, auth } = NextAuth({
	callbacks: {
		session: async ({ session, token }) => {
			session.user.id = token.userId as string;

			return session;
		},
		jwt: async ({ token }) => {
			const q = query(usersRef, where('username', '==', token.name));
			const querySnapshot = await getDocs(q);

			if (querySnapshot.empty) return null;

			const userDoc = querySnapshot.docs[0];
			const userId = userDoc.id;
			token.userId = userId;

			return token;
		},
	},
	providers: [
		Credentials({
			credentials: {
				username: { label: 'Username' },
				password: { label: 'Password', type: 'password' },
			},
			authorize: async credentials => {
				if (!credentials.username || !credentials.password) return null;

				// Query the users collection for the username
				const q = query(
					usersRef,
					where('username', '==', credentials.username)
				);
				const querySnapshot = await getDocs(q);

				if (querySnapshot.empty) return null;

				const userDoc = querySnapshot.docs[0];
				const user = userDoc.data();
				const userId = userDoc.id;

				if (!user) return null;

				const passwordsMatch = await bcrypt.compare(
					credentials.password as string,
					user.hashedPassword
				);
				if (!passwordsMatch) return null;

				return {
					email: user.email,
					name: credentials.username as string,
					userId: userId,
				};
			},
		}),
	],
});
