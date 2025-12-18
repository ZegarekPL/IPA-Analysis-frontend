'use client';

import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { toast } from 'sonner';

import AddGroupFormContent from './AddGroupFormContent';

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export default function AddGroupForm() {
	const [open, setOpen] = useState(false);

	const handleSuccess = () => {
		toast.success('Grupa dodana 🎉', {
			description: 'Nowa grupa została zapisana pomyślnie.',
		});
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant="outline" size="sm">
					<IconPlus />
					<span className="hidden lg:inline">Add Groups</span>
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-2xl">
				<AlertDialogHeader>
					<AlertDialogTitle>{'Utwórz nową grupę'}</AlertDialogTitle>
					<AlertDialogDescription>{'Wypełnij poniższy formularz, aby utworzyć nową grupę.'}</AlertDialogDescription>
				</AlertDialogHeader>

				<AddGroupFormContent onCancel={() => setOpen(false)} onSuccess={handleSuccess} />
			</AlertDialogContent>
		</AlertDialog>
	);
}
