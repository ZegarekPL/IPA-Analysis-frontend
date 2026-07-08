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
import { useTranslations } from 'next-intl';

interface DeleteUsersProps {
	user: any;
}

export default function DeleteUsersForm({ user }: DeleteUsersProps) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();
	const t = useTranslations();

	const deleteMutation = useMutation({
		mutationFn: () => deleteUser(user.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
			toast.success(t("DeleteUsersForm.toast_title"), {
				description: t("DeleteUsersForm.toast_description"),
			});
			setOpen(false);
		},
		onError: (error) => {
			console.error('t("DeleteUsersForm.error_deleting_form")', error);
			toast.error(t("DeleteUsersForm.error_deleting_form_description"));
		},
	});

	const handleConfirm = () => {
		deleteMutation.mutate();
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<span>{t('DeleteUsersForm.delete_user')}</span>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle>{t('DeleteUsersForm.confirm_delete')}</AlertDialogTitle>
					<AlertDialogDescription>
						{t('DeleteUsersForm.remove_user')}
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<Button variant="destructive" onClick={handleConfirm} disabled={deleteMutation.isPending}>
						{deleteMutation.isPending ? t('DeleteUsersForm.deleting') : t('DeleteUsersForm.confirm')}
					</Button>
					<AlertDialogCancel>{t('DeleteUsersForm.cancel')}</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
