import { Timestamp } from 'firebase/firestore';

export interface Artwork {
	id: string;
	name: string;
	startValue: number;
	endsAt: Timestamp;
	imageUrl: string;
	userId: string;
	createdAt: Timestamp;
	username: string;
	highestBid: number;
}

export interface User {
	id: string;
	username: string;
	email: string;
	artworks: string[];
}

export interface Bid {
	userId: string;
	amount: number;
	timestamp: Timestamp;
	username: string;
}

export interface Notification {
	id?: string;
	artworkId: string;
	message: string;
	timestamp: Timestamp;
	read: boolean;
}
