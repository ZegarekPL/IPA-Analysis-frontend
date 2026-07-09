'use client';

import { useState } from 'react';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Answer, subminAnswer } from '../../db/api';

import { AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface SubmitAnswerFormContentProps {
	testId: string;
	closedQuestions: {
		id: string;
		text: string;
	}[];
	openQuestion: string;
	onCancel: () => void;
	onSuccess: () => void;
}

export default function SubmitAnswerFormContent({
	testId,
	closedQuestions,
	openQuestion,
	onCancel,
	onSuccess,
}: SubmitAnswerFormContentProps) {
	const queryClient = useQueryClient();

	const [openAnswer, setOpenAnswer] = useState('');
	const [closedAnswers, setClosedAnswers] = useState<Record<string, number>>({});
	const t = useTranslations();
	
	const submitMutation = useMutation({
		mutationFn: (data: Answer) => subminAnswer(testId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tests'] });
			onSuccess();
		},
		onError: (error) => {
			console.error('Błąd podczas wysyłania odpowiedzi:', error);
		},
	});

	const handleChangeClosed = (questionId: string, value: number) => {
		setClosedAnswers((prev) => ({
			...prev,
			[questionId]: value,
		}));
	};

	const handleSubmit = () => {
		if (Object.keys(closedAnswers).length !== closedQuestions.length) {
			return alert('Odpowiedz na wszystkie pytania zamknięte');
		}

		const payload: Answer = {
			openAnswer,
			closedAnswers: Object.entries(closedAnswers).map(([questionId, value]) => ({
				questionId,
				value,
			})),
		};

		submitMutation.mutate(payload);
	};

	return (
		<div className="space-y-6">
			<div>
				<h3 className="font-semibold mb-3">{t('SubmitAnswerFormContent.closed_questions')}</h3>

				{closedQuestions.map((q, index) => (
					<div key={q.id} className="mb-4">
						<p className="mb-2 font-medium">
							{index + 1}. {q.text}
						</p>

						<div className="flex gap-2">
							{[1, 2, 3, 4, 5].map((val) => (
								<Button
									key={val}
									type="button"
									variant={closedAnswers[q.id] === val ? 'default' : 'outline'}
									onClick={() => handleChangeClosed(q.id, val)}
								>
									{val}
								</Button>
							))}
						</div>
					</div>
				))}
			</div>

			<div>
				<h3 className="font-semibold mb-2">{t('SubmitAnswerFormContent.open_questions')}</h3>
				<p className="mb-2 text-sm text-muted-foreground">{openQuestion}</p>

				<textarea
					value={openAnswer}
					onChange={(e) => setOpenAnswer(e.target.value)}
					className="w-full border p-2 rounded min-h-[100px]"
					placeholder={t('SubmitAnswerFormContent.open_question_placeholder')}
				/>
			</div>

			<AlertDialogFooter>
				<Button onClick={handleSubmit} disabled={submitMutation.isPending}>
					{submitMutation.isPending ? t('SubmitAnswerFormContent.sending') : t('SubmitAnswerFormContent.submit_answers')}
				</Button>
				<AlertDialogCancel onClick={onCancel}>{t('SubmitAnswerFormContent.cancel')}</AlertDialogCancel>
			</AlertDialogFooter>
		</div>
	);
}
