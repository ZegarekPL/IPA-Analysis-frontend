'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteUser } from '../../db/api';

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

interface DeleteUsersProps {
	user: any;
}

export default function DeleteUsersForm({ user }: DeleteUsersProps) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();

	const deleteMutation = useMutation({
		mutationFn: () => deleteUser(user.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			toast.success('Użytkownik usunięty 🗑️', {
				description: 'Użytkownik został pomyślnie usunięty.',
			});
			setOpen(false);
		},
		onError: (error) => {
			console.error('Błąd podczas usuwania użytkownika:', error);
			toast.error('Nie udało się usunąć użytkownika');
		},
	});

	const handleConfirm = () => {
		deleteMutation.mutate();
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<span>Usuń użytkownika</span>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle>Potwierdź usunięcie</AlertDialogTitle>
					<AlertDialogDescription>
						Czy na pewno chcesz usunąć użytkownika? Operacji nie da się cofnąć.
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
