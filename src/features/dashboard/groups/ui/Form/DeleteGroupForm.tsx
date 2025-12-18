'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteGroup, EditGroupFormProps } from '../../db/api';

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

interface DeleteGroupProps {
	group: EditGroupFormProps['group'];
}

export default function DeleteGroupForm({ group }: DeleteGroupProps) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: () => deleteGroup(group.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['all', 'groups'] });
			toast.success('Grupa usunięta 🗑️', {
				description: 'Grupa została pomyślnie usunięta.',
			});
			setOpen(false);
		},
		onError: (error) => {
			console.error('Błąd podczas usuwania grupy:', error);
			toast.error('Nie udało się usunąć grupy');
		},
	});

	const handleConfirm = () => {
		deleteMutation.mutate();
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<span>Usuń grupę</span>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle>Potwierdź usunięcie</AlertDialogTitle>
					<AlertDialogDescription>
						Czy na pewno chcesz usunąć grupę "{group.name}"? Operacji nie da się cofnąć.
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
