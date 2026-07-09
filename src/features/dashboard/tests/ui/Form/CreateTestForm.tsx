'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import CreateTestFormContent from './CreateTestFormContent';

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function CreateTestForm({ templateId }: { templateId: string }) {
	const [open, setOpen] = useState(false);

	const handleSuccess = () => {
		toast.success('Szablon edytowany 🎉', {
			description: 'Szablon został zapisany pomyślnie.',
		});
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<span className="cursor-pointer text-sm hover:bg-accent hover:text-accent-foreground rounded-sm px-2 py-1.5 w-full block">
					Create a Test
				</span>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-2xl">
				<AlertDialogHeader>
					<AlertDialogTitle>{'Edytuj grupę'}</AlertDialogTitle>
					<AlertDialogDescription>{'Wypełnij poniższy formularz, aby edytować grupę.'}</AlertDialogDescription>
				</AlertDialogHeader>

				<CreateTestFormContent templateId={templateId} onCancel={() => setOpen(false)} onSuccess={handleSuccess} />
			</AlertDialogContent>
		</AlertDialog>
	);
}
