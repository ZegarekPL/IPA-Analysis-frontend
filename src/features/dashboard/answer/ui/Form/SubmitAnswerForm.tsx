'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import SubmitAnswerFormContent from './SubmitAnswerFormContent';

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { getTestById } from '@/features/dashboard/tests/db/api';
import { useTranslations } from 'next-intl';

interface SubmitAnswerFormProps {
	testId: string;
}

export default function SubmitAnswerForm({ testId }: SubmitAnswerFormProps) {
	const [open, setOpen] = useState(false);
	const t = useTranslations();	

	const { data, isLoading, isError } = useQuery({
		queryKey: ['test', testId],
		queryFn: () => getTestById(testId),
		enabled: open,
	});

	const handleSuccess = () => {
		toast.success('Odpowiedzi wysłane', {
			description: 'Twoje odpowiedzi zostały zapisane.',
		});
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button className="w-full">{t('SubmitAnswerForm.take_test')}</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-2xl">
				<AlertDialogHeader>
					<AlertDialogTitle>{t('SubmitAnswerForm.take_the_test')}</AlertDialogTitle>
					<AlertDialogDescription>{t('SubmitAnswerForm.answer_questions')}</AlertDialogDescription>
				</AlertDialogHeader>

				{isLoading && <p>{t('SubmitAnswerForm.loading_questions')}</p>}
				{isError && <p className="text-red-500">{t('SubmitAnswerForm.error_loading_test')}</p>}

				{data && (
					<SubmitAnswerFormContent
						testId={testId}
						closedQuestions={data.data.template.closedQuestions.map((q) => ({
							id: q._id,
							text: q.text,
						}))}
						openQuestion={data.data.template.openQuestion.text}
						onCancel={() => setOpen(false)}
						onSuccess={handleSuccess}
					/>
				)}
			</AlertDialogContent>
		</AlertDialog>
	);
}
