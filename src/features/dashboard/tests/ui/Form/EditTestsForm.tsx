'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import EditTestsFormContent from './EditTestsFormContent';

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTranslations } from 'next-intl';

export interface EditTestsFormProps {
	test: {
		id: string;
		name: string;
		description: string;
		startsAt: string;
		endsAt: string;
		active: boolean;
	};
}

export default function EditTestsForm({ test }: EditTestsFormProps) {
	const [open, setOpen] = useState(false);
	const t = useTranslations();
	
	const handleSuccess = () => {
		toast.success(t("EditTestsForm.toast_title"), {
			description: t("EditTestsForm.toast_description"),
		});
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<span className="cursor-pointer text-sm hover:bg-accent hover:text-accent-foreground rounded-sm px-2 py-1.5 w-full block">
					{t("EditTestsForm.edit_test")}
				</span>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-2xl">
				<AlertDialogHeader>
					<AlertDialogTitle>{t("EditTestsForm.test_name")}</AlertDialogTitle>
					<AlertDialogDescription>{t("EditTestsForm.test_description")}</AlertDialogDescription>
				</AlertDialogHeader>

				<EditTestsFormContent initialData={test} onCancel={() => setOpen(false)} onSuccess={handleSuccess} />
			</AlertDialogContent>
		</AlertDialog>
	);
}
