'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import CreateTestFormContent from './CreateTestFormContent';

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTranslations } from 'next-intl';

export default function CreateTestForm({ templateId }: { templateId: string }) {
	const [open, setOpen] = useState(false);
	const t = useTranslations();

	const handleSuccess = () => {
		toast.success(t("CreateTestForm.toast_title"), {
			description: t("CreateTestForm.toast_description"),
		});
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<span className="cursor-pointer text-sm hover:bg-accent hover:text-accent-foreground rounded-sm px-2 py-1.5 w-full block">
					{t("CreateTestForm.create_test")}
				</span>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-2xl">
				<AlertDialogHeader>
					<AlertDialogTitle>{t("CreateTestForm.test_title")}</AlertDialogTitle>
					<AlertDialogDescription>{t("CreateTestForm.test_description")}</AlertDialogDescription>
				</AlertDialogHeader>

				<CreateTestFormContent templateId={templateId} onCancel={() => setOpen(false)} onSuccess={handleSuccess} />
			</AlertDialogContent>
		</AlertDialog>
	);
}
