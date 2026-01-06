'use client';

import { useState } from 'react';
import { AlertDialogCancel } from '@radix-ui/react-alert-dialog';
import { InfiniteData, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { CreateTest, createTest } from '../../db/api';
import { getAllGroups, GetGroupsResponse, Groups } from '../../../groups/db/api';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CreateTestFormContentProps {
	templateId: string;
	onCancel: () => void;
	onSuccess: () => void;
}

export default function CreateTestFormContent({ templateId, onCancel, onSuccess }: CreateTestFormContentProps) {
	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [selectedGroup, setSelectedGroup] = useState<string>('');
	const [startsAt, setStartsAt] = useState('');
	const [endsAt, setEndsAt] = useState('');

	const queryClient = useQueryClient();

	const rowsPerPage = 5;

	const infinite = useInfiniteQuery<GetGroupsResponse, Error, InfiniteData<GetGroupsResponse>, string[], number>({
		queryKey: ['groups'],
		queryFn: ({ pageParam }) => getAllGroups({ page: pageParam, rowsPerPage, search: '' }),
		initialPageParam: 1,
		getNextPageParam: (lastPage, pages) => (pages.length * rowsPerPage < lastPage.total ? pages.length + 1 : undefined),
	});

	const createMutation = useMutation({
		mutationFn: (data: CreateTest) => createTest(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['tests'] });
			onSuccess();
		},
		onError: (error) => {
			console.error('Błąd podczas tworzenia testu:', error);
		},
	});

	const handleSubmit = () => {
		if (!selectedGroup) return alert('Wybierz grupę!');
		if (!startsAt || !endsAt) return alert('Wybierz datę rozpoczęcia i zakończenia testu!');
		const data: CreateTest = {
			templateId,
			groupId: selectedGroup,
			name,
			description,
			startsAt: new Date(startsAt),
			endsAt: new Date(endsAt),
		};
		createMutation.mutate(data);
	};

	return (
		<div>
			<div className="mb-4">
				<label className="block mb-1 font-semibold">Nazwa testu</label>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full border p-2 rounded"
				/>
			</div>

			<div className="mb-4">
				<label className="block mb-1 font-semibold">Opis testu</label>
				<textarea
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="w-full border p-2 rounded"
				/>
			</div>

			<div className="mb-4">
				<Label className="block mb-1 font-semibold">Wybierz grupę</Label>
				{infinite.isLoading ? (
					<p className="text-muted-foreground">Ładowanie grup...</p>
				) : (
					<Select value={selectedGroup} onValueChange={setSelectedGroup}>
						<SelectTrigger>
							<SelectValue placeholder="-- Wybierz grupę --" />
						</SelectTrigger>
						<SelectContent>
							{infinite.data?.pages
								.flatMap((p) => p.data)
								.map((group) => (
									<SelectItem key={group._id} value={group._id}>
										{group.name} ({group.membersCount} członków)
									</SelectItem>
								))}
						</SelectContent>
					</Select>
				)}
			</div>

			<div className="mb-4">
				<Label className="block mb-1 font-semibold">Data rozpoczęcia</Label>
				<input
					type="datetime-local"
					value={startsAt}
					onChange={(e) => setStartsAt(e.target.value)}
					className="w-full border p-2 rounded"
				/>
			</div>

			<div className="mb-4">
				<Label className="block mb-1 font-semibold">Data zakończenia</Label>
				<input
					type="datetime-local"
					value={endsAt}
					onChange={(e) => setEndsAt(e.target.value)}
					className="w-full border p-2 rounded"
				/>
			</div>

			<AlertDialogFooter>
				<Button onClick={handleSubmit} disabled={createMutation.isPending}>
					{createMutation.isPending ? 'Tworzenie...' : 'Utwórz test'}
				</Button>
				<AlertDialogCancel onClick={onCancel}>Anuluj</AlertDialogCancel>
			</AlertDialogFooter>
		</div>
	);
}
