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

interface SubmitAnswerFormProps {
	testId: string;
}

export default function SubmitAnswerForm({ testId }: SubmitAnswerFormProps) {
	const [open, setOpen] = useState(false);

	const { data, isLoading, isError } = useQuery({
		queryKey: ['test', testId],
		queryFn: () => getTestById(testId),
		enabled: open,
	});

	console.log('testData', data);

	const handleSuccess = () => {
		toast.success('Odpowiedzi wysłane 🎉', {
			description: 'Twoje odpowiedzi zostały zapisane.',
		});
		setOpen(false);
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button className="mt-4 w-full">Take Test</Button>
			</AlertDialogTrigger>

			<AlertDialogContent className="max-w-2xl">
				<AlertDialogHeader>
					<AlertDialogTitle>Rozwiąż test</AlertDialogTitle>
					<AlertDialogDescription>Odpowiedz na wszystkie pytania i zapisz test.</AlertDialogDescription>
				</AlertDialogHeader>

				{isLoading && <p>Ładowanie pytań...</p>}
				{isError && <p className="text-red-500">Błąd ładowania testu</p>}

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
