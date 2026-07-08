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
import { useTranslations } from 'next-intl';

interface DeleteGroupProps {
	group: EditGroupFormProps['group'];
}

export default function DeleteGroupForm({ group }: DeleteGroupProps) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();
	const t = useTranslations();

	const deleteMutation = useMutation({
		mutationFn: () => deleteGroup(group.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['groups', 'all'] });
			toast.success(t("DeleteGroupForm.toast_title"), {
				description: t("DeleteGroupForm.toast_description"),
			});
			setOpen(false);
		},
		onError: (error) => {
			console.error('t("DeleteGroupForm.error_deleting_group")', error);
			toast.error(t("DeleteGroupForm.error_deleting_group_description"));
		},
	});

	const handleConfirm = () => {
		deleteMutation.mutate();
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<span>{t('DeleteGroupForm.delete_group')}</span>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle>{t('DeleteGroupForm.confirm_delete_group')}</AlertDialogTitle>
					<AlertDialogDescription>
						{t('DeleteGroupForm.delete_group_description1')} "{group.name}"? {t('DeleteGroupForm.delete_group_description2')}
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<Button variant="destructive" onClick={handleConfirm} disabled={deleteMutation.isPending}>
						{deleteMutation.isPending ? t('DeleteGroupForm.deleting') : t('DeleteGroupForm.confirm')}
					</Button>
					<AlertDialogCancel>{t('DeleteGroupForm.cancel')}</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
