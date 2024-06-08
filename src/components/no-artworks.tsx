import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

export default function NoArtworks() {
	return (
		<div className='max-w-lg mx-auto mt-16'>
			<Alert variant='destructive'>
				<AlertCircle className='h-4 w-4' />
				<AlertTitle>No artworks fund</AlertTitle>
				<AlertDescription>No artworks found to be shown.</AlertDescription>
			</Alert>
		</div>
	);
}
