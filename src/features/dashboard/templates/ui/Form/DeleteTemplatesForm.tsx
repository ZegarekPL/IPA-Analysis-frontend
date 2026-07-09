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
import { useTranslations } from 'next-intl';

interface DeleteTemplatesProps {
	template: EditTemplatesFormProps['template'];
}

export default function DeleteTemplatesForm({ template }: DeleteTemplatesProps) {
	const [open, setOpen] = useState(false);
	const queryClient = useQueryClient();
	const t = useTranslations();
	
	const deleteMutation = useMutation({
		mutationFn: () => deleteTemplates(template.id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['templates'] });
			toast.success(t("DeleteTemplatesForm.toast_title"), {
				description: t("DeleteTemplatesForm.toast_description"),
			});
			setOpen(false);
		},
		onError: (error) => {
			console.error('t("DeleteTemplatesForm.error_deleting_template")', error);
			toast.error(t("DeleteTemplatesForm.error_deleting_template_description"));
		},
	});

	const handleConfirm = () => {
		deleteMutation.mutate();
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<span>{t('DeleteTemplatesForm.delete_template')}</span>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle>{t('DeleteTemplatesForm.delete_template')}</AlertDialogTitle>
					<AlertDialogDescription>
						{t('DeleteTemplatesForm.delete_template_description1')} "{template.name}"? {t('DeleteTemplatesForm.delete_template_description2')}
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<Button variant="destructive" onClick={handleConfirm} disabled={deleteMutation.isPending}>
						{deleteMutation.isPending ? t('DeleteTemplatesForm.deleting') : t('DeleteTemplatesForm.confirm')}
					</Button>
					<AlertDialogCancel>{t('DeleteTemplatesForm.cancel')}</AlertDialogCancel>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
