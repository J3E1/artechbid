'use server';

import {
	addDoc,
	arrayUnion,
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	runTransaction,
	setDoc,
	where,
} from 'firebase/firestore';
import {
	LoginSchema,
	RegisterSchema,
	loginSchema,
	registerSchema,
} from './schemas';
import bcrypt from 'bcrypt';
import { artworksRef, db, storage, usersRef } from './firebase';
import { auth, signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { placeBid } from './utils';

export const login = async (values: LoginSchema) => {
	try {
		const validatedFields = loginSchema.safeParse(values);
		if (!validatedFields.success)
			return { error: 'Please enter valid credentials.' };
		await signIn('credentials', { ...validatedFields.data, redirect: false });
		return { success: 'Logged in successfully.' };
	} catch (error) {
		if (error instanceof AuthError) {
			switch (error.type) {
				case 'CredentialsSignin':
					return { error: 'Please enter valid credentials.' };
				default:
					return { error: 'Something went wrong.' };
			}
		}
		throw error;
	}
};
export const register = async (values: RegisterSchema) => {
	const validatedFields = registerSchema.safeParse(values);
	if (!validatedFields.success)
		return { error: 'Please enter valid credentials.' };

	const { email, password, username } = validatedFields.data;

	// Check if username already exists
	const q = query(usersRef, where('username', '==', username));
	const querySnapshot = await getDocs(q);
	if (!querySnapshot.empty) {
		return { error: 'Username already in use.' };
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	// Generate a unique ID for the new user document
	const newUserRef = doc(usersRef);

	// Store user information in Firestore
	await setDoc(newUserRef, {
		username,
		email,
		hashedPassword,
	});

	// await signIn('credentials', { ...validatedFields.data, redirect: false });

	return { success: 'Account created successfully.' };
};

export const addArtwork = async (values: FormData) => {
	try {
		const session = await auth();
		if (!session) return { error: 'Please login.' };

		let newArtworkId = '';
		const q = query(usersRef, where('username', '==', session.user?.name!));
		const querySnapshot = await getDocs(q);
		const userDoc = querySnapshot.docs[0];
		const userId = userDoc.id;
		const name = values.get('name') as string;
		const startValue = parseInt(values.get('startValue') as string);
		const endsAt = new Date(values.get('endsAt') as string);
		const image = values.get('image') as File;

		if (!name || !startValue || isNaN(startValue) || !endsAt || !image) {
			return { error: 'Invalid input data.' };
		}

		const uniqueImageName = `${Date.now()}-${image.name}`;

		// Upload image to Firebase Storage
		const imageRef = ref(storage, `artworks/${uniqueImageName}`);
		await uploadBytes(imageRef, image);
		const imageUrl = await getDownloadURL(imageRef);
		// Use Firestore transaction to add artwork and update user document
		await runTransaction(db, async transaction => {
			// Add artwork details to Firestore
			const newArtworkRef = doc(artworksRef);
			transaction.set(newArtworkRef, {
				name,
				startValue,
				endsAt,
				imageUrl,
				userId, // Reference to the user who created the artwork
				createdAt: new Date(),
			});

			// Update user document to include the new artwork ID
			const userDocRef = doc(usersRef, userId);
			transaction.update(userDocRef, {
				artworks: arrayUnion(newArtworkRef.id),
			});
			newArtworkId = newArtworkRef.id;
		});

		return {
			success: 'Artwork added successfully.',
			id: newArtworkId,
		};
	} catch (error) {
		if (error instanceof Error)
			return { error: `Error adding artwork: ${error.message}` };
		return { error: `Error adding artwork` };
	}
};

export const placeBidAction = async (
	artworkId: string,
	userId: string,
	amount: number
) => {
	try {
		const res = await placeBid(artworkId, userId, amount);
		return { success: res.success };
	} catch (error) {
		if (error instanceof Error)
			return { error: `Error on bid: ${error.message}` };
		return { error: `Error` };
	}
};
