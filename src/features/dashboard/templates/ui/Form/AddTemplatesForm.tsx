'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import AddTemplatesFormContent from './AddTemplatesFormContent';
import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';

export default function AddTemplatesForm() {
	const [open, setOpen] = useState(false);

	const handleSuccess = () => {
		toast.success('Szablon dodany 🎉', {
			description: 'Nowy szablon został zapisany pomyślnie.',
		});
		setOpen(false);
	};
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant="outline" size="sm">
					<IconPlus />
					<span className="hidden lg:inline">Create Templates</span>
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-2xl">
				<AlertDialogHeader>
					<AlertDialogTitle>Dodaj nową templatkę</AlertDialogTitle>
					<AlertDialogDescription>Wypełnij poniższy formularz, aby utworzyć nowy szablon.</AlertDialogDescription>
				</AlertDialogHeader>

				<AddTemplatesFormContent onCancel={() => setOpen(false)} onSuccess={() => handleSuccess()} />
			</AlertDialogContent>
		</AlertDialog>
	);
}
