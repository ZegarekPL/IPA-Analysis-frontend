'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { EditTemplatesFormProps } from '../../db/api';
import EditTemplatesFormContent from './EditTemplatesFormContent';

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTranslations } from 'next-intl';

export default function EditTemplatesForm({ template }: EditTemplatesFormProps) {
	const [open, setOpen] = useState(false);
	const t = useTranslations();
	
	const handleSuccess = () => {
		toast.success(t("EditTemplatesForm.toast_title"), {
			description: t("EditTemplatesForm.toast_description"),
		});
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<span className="cursor-pointer text-sm hover:bg-accent hover:text-accent-foreground rounded-sm px-2 py-1.5 w-full block">
					{t("EditTemplatesForm.edit_template")}
				</span>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-2xl">
				<AlertDialogHeader>
					<AlertDialogTitle>{t("EditTemplatesForm.template_name")}</AlertDialogTitle>
					<AlertDialogDescription>{t("EditTemplatesForm.template_description")}</AlertDialogDescription>
				</AlertDialogHeader>

				<EditTemplatesFormContent
					initialData={{ template }}
					onCancel={() => setOpen(false)}
					onSuccess={handleSuccess}
				/>
			</AlertDialogContent>
		</AlertDialog>
	);
}
