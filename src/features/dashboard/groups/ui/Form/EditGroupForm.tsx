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
import { useTranslations } from 'next-intl';

export default function EditGroupForm({ group }: EditGroupFormProps) {
	const [open, setOpen] = useState(false);
	const t = useTranslations();

	const handleSuccess = () => {
		toast.success(t("EditGroupForm.toast_title"), {
			description: t("EditGroupForm.toast_description"),
		});
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<span className="cursor-pointer text-sm hover:bg-accent hover:text-accent-foreground rounded-sm px-2 py-1.5 w-full block">
					{t('EditGroupForm.edit_group')}
				</span>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-2xl">
				<AlertDialogHeader>
					<AlertDialogTitle>{t('EditGroupForm.group_name')}</AlertDialogTitle>
					<AlertDialogDescription>{t('EditGroupForm.group_description')}</AlertDialogDescription>
				</AlertDialogHeader>

				<EditGroupFormContent initialData={{ group }} onCancel={() => setOpen(false)} onSuccess={handleSuccess} />
			</AlertDialogContent>
		</AlertDialog>
	);
}
