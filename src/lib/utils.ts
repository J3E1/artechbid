import { type ClassValue, clsx } from 'clsx';
import {
	DocumentData,
	Query,
	QueryDocumentSnapshot,
	QuerySnapshot,
	Timestamp,
	collection,
	doc,
	getDoc,
	getDocs,
	limit,
	onSnapshot,
	orderBy,
	query,
	runTransaction,
	updateDoc,
	where,
} from 'firebase/firestore';
import { twMerge } from 'tailwind-merge';
import { artworksRef, db, usersRef } from './firebase';
import { Artwork, Bid, Notification, User } from '../../typings';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const getAllArtwork = async (
	type: 'all' | 'live' | 'ended'
): Promise<Artwork[]> => {
	try {
		const now = new Date();
		let q: Query<DocumentData, DocumentData>;
		if (type === 'ended') {
			q = query(artworksRef, where('endsAt', '<', now));
		} else if (type === 'live') {
			q = query(artworksRef, where('endsAt', '>', now));
		} else {
			q = query(artworksRef);
		}

		const querySnapshot = await getDocs(q);
		const artworks: (Artwork & { username: string })[] = [];
		for (const artwork of querySnapshot.docs) {
			const artworkData = artwork.data() as Artwork;

			const userDocRef = doc(usersRef, artworkData.userId);
			const userDoc = await getDoc(userDocRef);

			let username = 'Unknown';
			if (userDoc.exists()) {
				const userData = userDoc.data() as User;
				username = userData.username;
			}

			// Fetch highest bid for the artwork
			const bidsRef = collection(db, `artworks/${artwork.id}/bids`);
			const bidsSnapshot = await getDocs(
				query(bidsRef, orderBy('amount', 'desc'), limit(1))
			);
			const highestBid = bidsSnapshot.empty
				? artworkData.startValue
				: (bidsSnapshot.docs[0].data() as Bid).amount;
			// @ts-ignore
			artworks.push({ id: artwork.id, ...artworkData, username, highestBid });
		}
		return artworks;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const getArtworkById = async (
	id: string
): Promise<Artwork & { username: string; bids: Bid[] }> => {
	try {
		const artworkDocRef = doc(artworksRef, id);
		const artworkDoc = await getDoc(artworkDocRef);

		if (!artworkDoc.exists()) {
			throw new Error(`Artwork with ID ${id} not found`);
		}

		const artworkData = artworkDoc.data() as Artwork;

		const userDocRef = doc(usersRef, artworkData.userId);

		const userDoc = await getDoc(userDocRef);

		if (!userDoc.exists()) {
			throw new Error(`User with ID ${artworkData.userId} not found`);
		}

		const userData = userDoc.data() as User;

		// Fetch bids for the artwork
		const bidsRef = collection(artworksRef, `${id}/bids`);
		const bidsSnapshot = await getDocs(
			query(bidsRef, orderBy('timestamp', 'desc'), limit(3))
		);
		const bids: Bid[] = await Promise.all(
			bidsSnapshot.docs.map(
				async (bidDoc: QueryDocumentSnapshot<DocumentData>) => {
					const bidData = bidDoc.data() as Bid;

					// Fetch the username for the user who made the bid
					const bidUserDocRef = doc(usersRef, bidData.userId);
					const bidUserDoc = await getDoc(bidUserDocRef);
					let bidUsername = 'Unknown';

					if (bidUserDoc.exists()) {
						const bidUserData = bidUserDoc.data() as User;
						bidUsername = bidUserData.username;
					}

					return { ...bidData, username: bidUsername };
				}
			)
		);

		return {
			...artworkData,
			id: artworkDoc.id,
			username: userData.username,
			bids,
		};
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const getUserArtWorks = async (
	userId: string,
	type: 'all' | 'live' | 'ended'
): Promise<Artwork[]> => {
	try {
		const now = new Date();
		let q: Query<DocumentData, DocumentData>;
		if (type === 'ended') {
			q = query(
				artworksRef,
				where('userId', '==', userId),
				where('endsAt', '<', now)
			);
		} else if (type === 'live') {
			q = query(
				artworksRef,
				where('userId', '==', userId),
				where('endsAt', '>', now)
			);
		} else {
			q = query(artworksRef, where('userId', '==', userId));
		}
		const querySnapshot = await getDocs(q);
		const artworks: (Artwork & { username: string })[] = [];
		for (const artwork of querySnapshot.docs) {
			const artworkData = artwork.data() as Artwork;

			const userDocRef = doc(usersRef, artworkData.userId);
			const userDoc = await getDoc(userDocRef);

			let username = 'Unknown';
			if (userDoc.exists()) {
				const userData = userDoc.data() as User;
				username = userData.username;
			}

			// Fetch highest bid for the artwork
			const bidsRef = collection(db, `artworks/${artwork.id}/bids`);
			const bidsSnapshot = await getDocs(
				query(bidsRef, orderBy('amount', 'desc'), limit(1))
			);
			const highestBid = bidsSnapshot.empty
				? artworkData.startValue
				: (bidsSnapshot.docs[0].data() as Bid).amount;
			// @ts-ignore
			artworks.push({ id: artwork.id, ...artworkData, username, highestBid });
		}
		return artworks;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};
export const placeBid = async (
	artworkId: string,
	userId: string,
	amount: number
): Promise<{ success?: string }> => {
	try {
		const artworkDocRef = doc(db, 'artworks', artworkId);
		const artworkDoc = await getDoc(artworkDocRef);

		if (!artworkDoc.exists()) {
			throw new Error('Artwork not found.');
		}

		const artworkData = artworkDoc.data() as Artwork;
		if (artworkData.userId === userId) {
			throw new Error('You cannot bid on your own artwork.');
		}

		// Fetch the last bid before starting the transaction
		const bidsRef = collection(db, `artworks/${artworkId}/bids`);
		const lastBidSnapshot = await getDocs(
			query(bidsRef, orderBy('timestamp', 'desc'), limit(1))
		);
		const lastBid = lastBidSnapshot.empty
			? null
			: (lastBidSnapshot.docs[0].data() as Bid);

		await runTransaction(db, async transaction => {
			const newBidRef = doc(bidsRef);

			if(lastBid && lastBid.userId === userId) {
				throw new Error('You have already placed a bid on this artwork.');
			}

			if (lastBid && lastBid.amount >= amount) {
				throw new Error(
					'Your bid must be higher than the current highest bid.'
				);
			}

			transaction.set(newBidRef, {
				userId,
				amount,
				timestamp: Timestamp.now(),
			});

			if (lastBid) {
				const notificationRef = collection(
					usersRef,
					`${lastBid.userId}/notifications`
				);
				const newNotificationRef = doc(notificationRef);
				const res = transaction.set(newNotificationRef, {
					message: `You have been outbid on the artwork: ${artworkData.name}`,
					timestamp: Timestamp.now(),
					read: false,
					artworkId: artworkId,
				});
			}
		});

		return { success: 'Bid placed successfully.' };
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const getUserNotifications = async (
	userId: string
): Promise<Notification[] | { error: string }> => {
	try {
		const notificationsRef = collection(usersRef, `${userId}/notifications`);
		const q = query(
			notificationsRef,
			where('read', '==', false),
			orderBy('timestamp', 'desc')
		);
		const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(q);
		// Check if querySnapshot is empty
		if (querySnapshot.empty) {
			return [];
		}

		const notifications: Notification[] = [];
		querySnapshot.forEach(doc => {
			notifications.push({ id: doc.id, ...doc.data() } as Notification);
		});

		return notifications;
	} catch (error) {
		throw new Error((error as Error).message);
	}
};

export const getRTUserNotifications = (
	userId: string,
	callback: (notifications: Notification[]) => void
) => {
	const notificationsRef = collection(usersRef, `${userId}/notifications`);
	const unreadNotificationsQuery = query(
		notificationsRef,
		where('read', '==', false)
	);

	return onSnapshot(unreadNotificationsQuery, snapshot => {
		const notifications: Notification[] = snapshot.docs.map(
			doc =>
				({
					...doc.data(),
					timestamp: doc.data().timestamp.toDate(),
				} as Notification)
		);

		callback(notifications);
	});
};

export const markNotificationAsRead = async (
	userId: string,
	notificationId: string
): Promise<{ success?: string; error?: string }> => {
	try {
		const notificationRef = doc(
			usersRef,
			`${userId}/notifications/${notificationId}`
		);
		await updateDoc(notificationRef, {
			read: true,
		});
		return { success: 'Notification marked as read.' };
	} catch (error) {
		throw new Error((error as Error).message);
	}
};
export const calculateTimeLeft = (endsAt: Timestamp) => {
	const difference = +new Date(endsAt?.seconds * 1000) - +new Date();

	let timeLeft = {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	};

	if (difference > 0) {
		timeLeft = {
			days: Math.floor(difference / (1000 * 60 * 60 * 24)),
			hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
			minutes: Math.floor((difference / 1000 / 60) % 60),
			seconds: Math.floor((difference / 1000) % 60),
		};
	}

	return timeLeft;
};
