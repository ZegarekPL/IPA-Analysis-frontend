'use client';

import { useQuery } from '@tanstack/react-query';

import { formatDate } from '@/utils/formatDate';
import { getTemplates, TemplateTableRow } from '../db/api';
import { TemplatesDataTable } from './TemplatesDataTable';
import { useMemo } from 'react';
import AddTemplatesForm from './Form/AddTemplatesForm';
import { Tabs } from '@/components/ui/tabs';

export function TemplatesData() {
	const { data, isLoading } = useQuery({
		queryKey: ['templates'],
		queryFn: getTemplates,
	});

	const tableData = useMemo<TemplateTableRow[]>(() => {
		return (
			data?.map((t) => ({
				id: t._id,
				name: t.name,
				description: t.description,
				closedQuestions: t.closedQuestions ?? [],
				openQuestion: t.openQuestion.text,
				createdBy: t.createdBy,
				createdAt: formatDate(t.createdAt),
				updatedAt: formatDate(t.updatedAt),
			})) ?? []
		);
	}, [data]);

	if (isLoading) return <p className="text-center mt-10">Ładowanie...</p>;

	return (
		<Tabs className="w-full flex-col gap-6">
			<div className="flex items-center justify-between px-4 lg:px-6">
				<div></div>
				<AddTemplatesForm />
			</div>
			<TemplatesDataTable data={tableData} />
		</Tabs>
	);
}
