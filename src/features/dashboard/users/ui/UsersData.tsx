'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import { formatDate } from '@/utils/formatDate';
import { UsersDataTable } from './UsersDataTable';
import { getUsers } from '../db/api';
import { getErrorMessage } from '@/utils/getErrorMessage';

export function UsersData() {
	const t = useTranslations();

	const [page, setPage] = React.useState(1);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [search, setSearch] = React.useState('');

	const { data, isLoading, isError, error, refetch } = useQuery({
		queryKey: ['users', page, rowsPerPage, search],
		queryFn: () => getUsers({ page, rowsPerPage, search }),
		gcTime: 0,
	});
	const tableData = React.useMemo(() => {
		return (
			data?.data.map((g: any) => ({
				id: g._id,
				index: g.index,
				mail: g.mail,
				role: g.role,
				createdAt: formatDate(g.createdAt),
				updatedAt: formatDate(g.updatedAt),
			})) ?? []
		);
	}, [data]);

	if (isLoading) {
		return <p className="text-center mt-10">{t('Common.loading')}</p>;
	}

	if (isError) {
		return (
			<div className="text-center mt-10">
				<p className="text-red-500">{getErrorMessage(t, error)}</p>

				<button onClick={() => refetch()} className="mt-4 underline text-sm">
					{t('Common.try_again')}
				</button>
			</div>
		);
	}

	return (
		<UsersDataTable
			data={tableData}
			page={page}
			setPage={setPage}
			rowsPerPage={rowsPerPage}
			setRowsPerPage={setRowsPerPage}
			total={data?.total || 0}
			search={search}
			setSearch={setSearch}
		/>
	);
}
