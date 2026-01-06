'use client';

import { useState } from 'react';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

import { EditTests, editTests } from '../../db/api';

interface EditTestsFormContentProps {
	initialData: {
		id: string;
		name: string;
		description: string;
		startsAt: string;
		endsAt: string;
		active: boolean;
	};
	onCancel: () => void;
	onSuccess: () => void;
}

export default function EditTestsFormContent({ initialData, onCancel, onSuccess }: EditTestsFormContentProps) {
	const [name, setName] = useState(initialData.name);
	const [description, setDescription] = useState(initialData.description);
	const [startsAt, setStartsAt] = useState(initialData.startsAt);
	const [endsAt, setEndsAt] = useState(initialData.endsAt);
	const [active, setActive] = useState(initialData.active);

	const queryClient = useQueryClient();

	const editMutation = useMutation({
		mutationFn: (data: EditTests) => editTests(initialData.id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tests'] });
			onSuccess();
		},
		onError: (error) => {
			console.error('Błąd podczas edycji testu:', error);
		},
	});

	const handleSubmit = () => {
		const data: EditTests = {
			name,
			description,
			startsAt,
			endsAt,
			active,
		};

		editMutation.mutate(data);
	};

	return (
		<div>
			<div className="mb-4">
				<label className="block mb-1 font-semibold">Nazwa</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full border p-2 rounded"
				/>
			</div>

			<div className="mb-4">
				<label className="block mb-1 font-semibold">Opis</label>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="w-full border p-2 rounded"
				/>
			</div>

			<div className="mb-4 grid grid-cols-2 gap-4">
				<div>
					<label className="block mb-1 font-semibold">Start</label>
					<input
						type="datetime-local"
						value={startsAt}
						onChange={(e) => setStartsAt(e.target.value)}
						className="w-full border p-2 rounded"
					/>
				</div>

				<div>
					<label className="block mb-1 font-semibold">Koniec</label>
					<input
						type="datetime-local"
						value={endsAt}
						onChange={(e) => setEndsAt(e.target.value)}
						className="w-full border p-2 rounded"
					/>
				</div>
			</div>

			<div className="mb-4 flex items-center gap-2">
				<input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
				<label className="font-semibold">Aktywny</label>
			</div>

			<AlertDialogFooter>
				<Button onClick={handleSubmit} disabled={editMutation.isPending}>
					{editMutation.isPending ? 'Zapisywanie...' : 'Zapisz'}
				</Button>
				<AlertDialogCancel onClick={onCancel}>Anuluj</AlertDialogCancel>
			</AlertDialogFooter>
		</div>
	);
}
