'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteTemplates, EditTemplatesFormProps } from '../../db/api';

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface DeleteTemplatesProps {
	template: EditTemplatesFormProps['template'];
}

export default function DeleteGroupForm({ template }: DeleteTemplatesProps) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: () => deleteTemplates(template.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['templates'] });
			toast.success('Szablon usunięty 🗑️', {
				description: 'Szablon został pomyślnie usunięty.',
			});
			setOpen(false);
		},
		onError: (error) => {
			console.error('Błąd podczas usuwania szablonu:', error);
			toast.error('Nie udało się usunąć szablonu');
		},
	});

	const handleConfirm = () => {
		deleteMutation.mutate();
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<span>Usuń szablon</span>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle>Potwierdź usunięcie</AlertDialogTitle>
					<AlertDialogDescription>
						Czy na pewno chcesz usunąć szablon "{template.name}"? Operacji nie da się cofnąć.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<Button variant="destructive" onClick={handleConfirm} disabled={deleteMutation.isPending}>
						{deleteMutation.isPending ? 'Usuwanie...' : 'Potwierdzam'}
					</Button>
					<AlertDialogCancel>Anuluj</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
