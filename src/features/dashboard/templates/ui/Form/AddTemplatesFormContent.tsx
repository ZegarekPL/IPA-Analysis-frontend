'use client';

import { useState } from 'react';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ClosedQuestion, ClosedQuestionForm, CreateTemplates, Templates } from '@/features/dashboard/templates/db/api';
import { createTemplates } from '@/features/dashboard/templates/db/api';
import { useTranslations } from 'next-intl';

interface TemplateFormProps {
	initialData?: Templates;
	onCancel: () => void;
	onSuccess: () => void;
}

export default function AddTemplatesFormContent({ initialData, onCancel, onSuccess }: TemplateFormProps) {
	const t = useTranslations();
	const [name, setName] = useState(initialData?.name || '');
	const [description, setDescription] = useState(initialData?.description || '');
	const [openQuestion, setOpenQuestion] = useState(initialData?.openQuestion.text || '');
	const [closedQuestions, setClosedQuestions] = useState<ClosedQuestionForm[]>(
		initialData?.closedQuestions || [{ text: '', type: 'importance' }],
	);

	const queryClient = useQueryClient();

	const createMutation = useMutation({
		mutationFn: (form: CreateTemplates) => createTemplates(form),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['templates'] });
			onSuccess();
		},
		onError: (error) => {
			console.error('Błąd podczas tworzenia szablonu:', error);
		},
	});

	const handleAddClosedQuestion = () => setClosedQuestions([...closedQuestions, { text: '', type: 'importance' }]);

	const handleChangeClosedQuestion = (index: number, field: keyof ClosedQuestion, value: string) => {
		const updated = [...closedQuestions];
		(updated[index] as any)[field] = value;
		setClosedQuestions(updated);
	};

	const handleSubmit = () => {
		const data: CreateTemplates = {
			name,
			description,
			openQuestion: { text: openQuestion },
			closedQuestions,
		};
		createMutation.mutate(data);
	};

	return (
		<div>
			<div className="mb-4">
				<label className="block mb-1 font-semibold">{t('AddTemplatesFormContent.name')}</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full border p-2 rounded"
				/>
			</div>

			<div className="mb-4">
				<label className="block mb-1 font-semibold">{t('AddTemplatesFormContent.description')}</label>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="w-full border p-2 rounded"
				/>
			</div>

			<h3 className="font-semibold mb-2">{t('AddTemplatesFormContent.closed_questions')}</h3>
			{closedQuestions.map((q, i) => (
				<div key={i} className="flex gap-2 mb-2">
					<input
						type="text"
						placeholder={t('AddTemplatesFormContent.closed_question_text')}
						value={q.text}
						onChange={(e) => handleChangeClosedQuestion(i, 'text', e.target.value)}
						className="flex-1 border p-2 rounded"
					/>
					<select
						value={q.type}
						onChange={(e) => handleChangeClosedQuestion(i, 'type', e.target.value)}
						className="border p-2 rounded"
					>
						<option value="importance">{t('AddTemplatesFormContent.importance')}</option>
						<option value="performance">{t('AddTemplatesFormContent.performance')}</option>
					</select>
				</div>
			))}
			<Button variant="outline" className="mb-4" onClick={handleAddClosedQuestion}>
				{t('AddTemplatesFormContent.add_closed_question')}
			</Button>

			<div className="mb-4">
				<label className="block mb-1 font-semibold">{t('AddTemplatesFormContent.open_question')}</label>
				<input
					type="text"
					value={openQuestion}
					onChange={(e) => setOpenQuestion(e.target.value)}
					className="w-full border p-2 rounded"
				/>
			</div>

			<AlertDialogFooter>
				<Button onClick={handleSubmit} disabled={createMutation.isPending}>
					{createMutation.isPending ? t('AddTemplatesFormContent.saving') : t('AddTemplatesFormContent.save')}
				</Button>
				<AlertDialogCancel onClick={onCancel}>{t('AddTemplatesFormContent.cancel')}</AlertDialogCancel>
			</AlertDialogFooter>
		</div>
	);
}
