'use client';

import { useState } from 'react';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AlertDialogFooter } from '../../../../../components/ui/alert-dialog';
import { CreateGroups, createGroups } from '../../db/api';

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

interface AddGroupFormProps {
	initialData?: CreateGroups;
	onCancel: () => void;
	onSuccess: () => void;
}

export default function AddGroupFormContent({ initialData, onCancel, onSuccess }: AddGroupFormProps) {
	const [name, setName] = useState(initialData?.name || '');
	const [description, setDescription] = useState(initialData?.description || '');
	const t = useTranslations();

	const queryClient = useQueryClient();
	const createMutation = useMutation({
		mutationFn: (form: CreateGroups) => createGroups(form),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['groups', 'all'] });
			onSuccess();
		},
		onError: (error) => {
			console.error('Błąd podczas tworzenia grupy:', error);
		},
	});
	const handleSubmit = () => {
		const data: CreateGroups = { name, description };
		createMutation.mutate(data);
	};
	return (
		<div>
			<div className="mb-4">
				<label className="block mb-1 font-semibold">{t('AddGroupFormContent.name')}</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full border p-2 rounded"
				/>
			</div>
			<div className="mb-4">
				<label className="block mb-1 font-semibold">{t('AddGroupFormContent.description')}</label>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="w-full border p-2 rounded"
				/>
			</div>
			<AlertDialogFooter>
				<Button onClick={handleSubmit} disabled={createMutation.isPending}>
					{createMutation.isPending ? t('EditGroupFormContent.saving') : t('EditGroupFormContent.save')}
				</Button>
				<AlertDialogCancel onClick={onCancel}>{t('AddGroupFormContent.cancel')}</AlertDialogCancel>
			</AlertDialogFooter>
		</div>
	);
}
