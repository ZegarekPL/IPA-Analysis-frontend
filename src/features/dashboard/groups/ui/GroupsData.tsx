'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';

import { AllGroupsDataTable } from './AllGroupsDataTable';
import AddGroupForm from './Form/AddGroupForm';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllGroups, getMyGroups } from '@/features/dashboard/groups/db/api';
import { formatDate } from '@/utils/formatDate';
import { useTranslations } from 'next-intl';
import { getErrorMessage } from '@/utils/getErrorMessage';

export function GroupsTabs() {
	const [activeTab, setActiveTab] = React.useState<'all' | 'my'>('all');
	const t = useTranslations();

	const [page, setPage] = React.useState(1);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [search, setSearch] = React.useState('');

	React.useEffect(() => {
		setPage(1);
		setSearch('');
	}, [activeTab]);

	const { data, isLoading, isError, error, refetch } = useQuery({
		queryKey: [activeTab, 'groups', page, rowsPerPage, search],
		queryFn: () =>
			activeTab === 'all' ? getAllGroups({ page, rowsPerPage, search }) : getMyGroups({ page, rowsPerPage, search }),
		gcTime: 0,
	});

	const tableData = React.useMemo(() => {
		return (
			data?.data.map((g: any) => ({
				id: g._id,
				header: g.name,
				description: g.description,
				membersCount: g.membersCount.toString(),
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
		<Tabs
			value={activeTab}
			onValueChange={(value) => setActiveTab(value as 'all' | 'my')}
			className="w-full flex-col gap-6"
		>
			<div className="flex items-center justify-between px-4 lg:px-6">
				<TabsList>
					<TabsTrigger value="all">All Groups</TabsTrigger>
					<TabsTrigger value="my">My Groups</TabsTrigger>
				</TabsList>
				<AddGroupForm />
			</div>

			<TabsContent value="all">
				<AllGroupsDataTable
					data={activeTab === 'all' ? tableData : []}
					page={page}
					setPage={setPage}
					rowsPerPage={rowsPerPage}
					setRowsPerPage={setRowsPerPage}
					total={data?.total || 0}
					search={search}
					setSearch={setSearch}
				/>
			</TabsContent>

			<TabsContent value="my">
				<AllGroupsDataTable
					data={activeTab === 'my' ? tableData : []}
					page={page}
					setPage={setPage}
					rowsPerPage={rowsPerPage}
					setRowsPerPage={setRowsPerPage}
					total={data?.total || 0}
					search={search}
					setSearch={setSearch}
				/>
			</TabsContent>
		</Tabs>
	);
}
