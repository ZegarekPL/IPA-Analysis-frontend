'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';

import { formatDate } from '@/utils/formatDate';
import { UsersDataTable } from './UsersDataTable';
import { getUsers } from '../db/api';

export function UsersData() {
	const { data, isLoading } = useQuery({
		queryKey: ['users'],
		queryFn: getUsers,
	});

	const tableData = React.useMemo(() => {
		return (
			data?.map((g: any) => ({
				id: g._id,
				index: g.index,
				mail: g.mail,
				role: g.role,
				createdAt: formatDate(g.createdAt),
				updatedAt: formatDate(g.updatedAt),
			})) ?? []
		);
	}, [data]);

	if (isLoading) return <p className="text-center mt-10">Ładowanie...</p>;

	return <UsersDataTable data={tableData} />;
}
