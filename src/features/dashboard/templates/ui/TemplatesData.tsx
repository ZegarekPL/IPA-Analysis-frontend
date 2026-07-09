'use client';

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { getTemplates, TemplateTableRow } from '../db/api';
import AddTemplatesForm from './Form/AddTemplatesForm';
import { TemplatesDataTable } from './TemplatesDataTable';

import { Tabs } from '@/components/ui/tabs';
import { formatDate } from '@/utils/formatDate';
import { AppError, getErrorMessage } from '@/utils/getErrorMessage';

export function TemplatesData() {
	const t = useTranslations();

	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [search, setSearch] = useState('');

	const { data, isLoading, isError, error, refetch } = useQuery({
		queryKey: ['templates', page, rowsPerPage, search],
		queryFn: () => getTemplates({ page, rowsPerPage, search }),
		gcTime: 0,
	});

	const tableData = useMemo<TemplateTableRow[]>(() => {
		return (
			data?.data.map((t) => ({
				id: t._id,
				name: t.name,
				description: t.description,
				closedQuestions: t.closedQuestions ?? [],
				openQuestion: t.openQuestion.text,
				createdBy: t.createdBy,
				createdAt: formatDate(t.createdAt),
				updatedAt: formatDate(t.updatedAt),
				createdByIndex: t.createdByIndex,
			})) ?? []
		);
	}, [data]);

	if (isLoading) {
		return <p className="text-center mt-10">{t('Common.loading')}</p>;
	}

	if (isError) {
		const isForbidden = error instanceof AppError && error.errorCode === 'FORBIDDEN';

		return (
			<div className="text-center mt-10">
				<p className="text-red-500">{getErrorMessage(t, error)}</p>

				{!isForbidden && (
					<button onClick={() => refetch()} className="mt-4 underline text-sm">
						{t('Common.try_again')}
					</button>
				)}
			</div>
		);
	}

	return (
		<Tabs className="w-full flex-col gap-6">
			<div className="flex items-center justify-between px-4 lg:px-6">
				<div></div>
				<AddTemplatesForm />
			</div>
			<TemplatesDataTable
				data={tableData}
				page={page}
				setPage={setPage}
				rowsPerPage={rowsPerPage}
				setRowsPerPage={setRowsPerPage}
				total={data?.total || 0}
				search={search}
				setSearch={setSearch}
			/>
		</Tabs>
	);
}
