'use client';

import { useState } from 'react';
import { IconPlus } from '@tabler/icons-react';
import { toast } from 'sonner';

import AddGroupFormContent from './AddGroupFormContent';

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

export default function AddGroupForm() {
	const [open, setOpen] = useState(false);
	const t = useTranslations();
	
	const handleSuccess = () => {
		toast.success(t("AddGroupForm.toast_title"), {
			description: t("AddGroupForm.toast_description"),
		});
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button variant="outline" size="sm">
					<IconPlus />
					<span className="hidden lg:inline">{t("AddGroupForm.create_group")}</span>
				</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-2xl">
				<AlertDialogHeader>
					<AlertDialogTitle>{t("AddGroupForm.group_title")}</AlertDialogTitle>
					<AlertDialogDescription>{t("AddGroupForm.group_description")}</AlertDialogDescription>
				</AlertDialogHeader>

				<AddGroupFormContent onCancel={() => setOpen(false)} onSuccess={handleSuccess} />
			</AlertDialogContent>
		</AlertDialog>
	);
}
