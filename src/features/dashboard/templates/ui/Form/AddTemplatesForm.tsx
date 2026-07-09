'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import AddTemplatesFormContent from './AddTemplatesFormContent';

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function AddTemplatesForm() {
	const [open, setOpen] = useState(false);
	const t = useTranslations();

	const handleSuccess = () => {
		toast.success(t("AddTemplatesForm.toast_title"), {
			description: t("AddTemplatesForm.toast_description"),
		});
		setOpen(false);
	};
	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant="outline" size="sm">
					<IconPlus />
					<span className="hidden lg:inline">{t("AddTemplatesForm.create_template")}</span>
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-2xl">
				<AlertDialogHeader>
					<AlertDialogTitle>{t("AddTemplatesForm.template_title")}</AlertDialogTitle>
					<AlertDialogDescription>{t("AddTemplatesForm.template_description")}</AlertDialogDescription>
				</AlertDialogHeader>

				<AddTemplatesFormContent onCancel={() => setOpen(false)} onSuccess={() => handleSuccess()} />
			</AlertDialogContent>
		</AlertDialog>
	);
}
