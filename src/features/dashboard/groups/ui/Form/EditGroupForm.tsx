'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { EditGroupFormProps } from '../../db/api';
import EditGroupFormContent from './EditGroupFormContent';

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function EditGroupForm({ group }: EditGroupFormProps) {
	const [open, setOpen] = useState(false);

	const handleSuccess = () => {
		toast.success('Grupa edytowana 🎉', {
			description: 'Grupa została zapisana pomyślnie.',
		});
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<span className="cursor-pointer text-sm hover:bg-accent hover:text-accent-foreground rounded-sm px-2 py-1.5 w-full block">
					Edit Group
				</span>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-2xl">
				<AlertDialogHeader>
					<AlertDialogTitle>{'Edytuj grupę'}</AlertDialogTitle>
					<AlertDialogDescription>{'Wypełnij poniższy formularz, aby edytować grupę.'}</AlertDialogDescription>
				</AlertDialogHeader>

				<EditGroupFormContent initialData={{ group }} onCancel={() => setOpen(false)} onSuccess={handleSuccess} />
			</AlertDialogContent>
		</AlertDialog>
	);
}
