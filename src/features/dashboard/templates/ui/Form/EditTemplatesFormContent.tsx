'use client';

import { useState } from 'react';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AlertDialogFooter } from '../../../../../components/ui/alert-dialog';
import {
	ClosedQuestion,
	ClosedQuestionForm,
	CreateTemplates,
	editTemplates,
	EditTemplatesFormProps,
} from '../../db/api';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface EditTemplatesFormContentProps {
	initialData: EditTemplatesFormProps;
	onCancel: () => void;
	onSuccess: () => void;
}

export default function EditTemplatesFormContent({ initialData, onCancel, onSuccess }: EditTemplatesFormContentProps) {
	const [name, setName] = useState(initialData.template.name || '');
	const [description, setDescription] = useState(initialData.template.description || '');
	const [openQuestion, setOpenQuestion] = useState(initialData.template.openQuestion.text || '');
	const [closedQuestions, setClosedQuestions] = useState<ClosedQuestionForm[]>(
		initialData.template.closedQuestions.map(({ text, type }) => ({
			text,
			type,
		})),
	);
	const t = useTranslations();

	const queryClient = useQueryClient();
	const createMutation = useMutation({
		mutationFn: (form: CreateTemplates) => editTemplates(initialData?.template.id, form),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['groups', 'all'] });
			onSuccess();
		},
		onError: (error) => {
			console.error(t('EditTemplatesFormContent.error_editing_template'), error);
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
				<label className="block mb-1 font-semibold">{t('EditTemplatesFormContent.name')}</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full border p-2 rounded"
				/>
			</div>

			<div className="mb-4">
				<label className="block mb-1 font-semibold">{t('EditTemplatesFormContent.description')}</label>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="w-full border p-2 rounded"
				/>
			</div>

			<h3 className="font-semibold mb-2">{t('EditTemplatesFormContent.closed_questions')}</h3>
			{closedQuestions.map((q, i) => (
				<div key={i} className="flex gap-2 mb-2">
					<input
						type="text"
						placeholder={t('EditTemplatesFormContent.closed_question_text')}
						value={q.text}
						onChange={(e) => handleChangeClosedQuestion(i, 'text', e.target.value)}
						className="flex-1 border p-2 rounded"
					/>
					<select
						value={q.type}
						onChange={(e) => handleChangeClosedQuestion(i, 'type', e.target.value)}
						className="border p-2 rounded"
					>
						<option value="importance">{t('EditTemplatesFormContent.importance')}</option>
						<option value="performance">{t('EditTemplatesFormContent.performance')}</option>
					</select>
				</div>
			))}
			<Button variant="outline" className="mb-4" onClick={handleAddClosedQuestion}>
				{t('EditTemplatesFormContent.add_closed_question')}
			</Button>

			<div className="mb-4">
				<label className="block mb-1 font-semibold">{t('EditTemplatesFormContent.open_question')}</label>
				<input
					type="text"
					value={openQuestion}
					onChange={(e) => setOpenQuestion(e.target.value)}
					className="w-full border p-2 rounded"
				/>
			</div>

			<AlertDialogFooter>
				<Button onClick={handleSubmit} disabled={createMutation.isPending}>
					{createMutation.isPending ? t('EditTemplatesFormContent.saving') : t('EditTemplatesFormContent.save')}
				</Button>
				<AlertDialogCancel onClick={onCancel}>{t('EditTemplatesFormContent.cancel')}</AlertDialogCancel>
			</AlertDialogFooter>
		</div>
	);
}
