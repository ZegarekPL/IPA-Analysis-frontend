'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import EditTestsFormContent from './EditTestsFormContent';

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export interface EditTestsFormProps {
	test: {
		id: string;
		name: string;
		description: string;
		startsAt: string;
		endsAt: string;
		active: boolean;
	};
}

export default function EditTestsForm({ test }: EditTestsFormProps) {
	const [open, setOpen] = useState(false);

	const handleSuccess = () => {
		toast.success('Test edytowany 🎉', {
			description: 'Test został zapisany pomyślnie.',
		});
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<span className="cursor-pointer text-sm hover:bg-accent hover:text-accent-foreground rounded-sm px-2 py-1.5 w-full block">
					Edit Test
				</span>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-2xl">
				<AlertDialogHeader>
					<AlertDialogTitle>Edytuj test</AlertDialogTitle>
					<AlertDialogDescription>Wypełnij poniższy formularz, aby edytować test.</AlertDialogDescription>
				</AlertDialogHeader>

				<EditTestsFormContent initialData={test} onCancel={() => setOpen(false)} onSuccess={handleSuccess} />
			</AlertDialogContent>
		</AlertDialog>
	);
}
