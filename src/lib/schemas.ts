import { z } from 'zod';

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB
const ACCEPTED_FILE_TYPES = ['image/*'];
export const artworkSchema = z.object({
	name: z
		.string({ required_error: 'Please enter name for the artwork.' })
		.min(2)
		.max(50),
	startValue: z
		.number({
			invalid_type_error: 'Starting bid should be a number.',
			required_error: 'Please enter a starting bid.',
		})
		.min(1)
		.nonnegative('Please add a positive value.'),
	endsAt: z
		.date({ required_error: 'Please select a date' })
		.min(new Date(), 'Please select a date in future.'),
});

export type ArtWorkSchema = z.infer<typeof artworkSchema>;
