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
import { getUser } from '@/features/auth/Login';

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

	const {
		data: userData,
		isLoading: userLoading,
		isError: userError,
	} = useQuery({
		queryKey: ['getUser'],
		queryFn: getUser,
	});

	const {
		data: groupsData,
		isLoading: groupsLoading,
		isError: groupsError,
		error,
		refetch,
	} = useQuery({
		queryKey: [activeTab, 'groups', page, rowsPerPage, search],
		queryFn: () =>
			activeTab === 'all' ? getAllGroups({ page, rowsPerPage, search }) : getMyGroups({ page, rowsPerPage, search }),
		gcTime: 0,
	});

	const tableData = React.useMemo(() => {
		return (
			groupsData?.data.map((g: any) => ({
				id: g._id,
				header: g.name,
				description: g.description,
				isMember: g.isMember,
				membersCount: g.membersCount.toString(),
				createdAt: formatDate(g.createdAt),
				updatedAt: formatDate(g.updatedAt),
			})) ?? []
		);
	}, [groupsData]);

	if (groupsLoading || userLoading) {
		return <p className="text-center mt-10">{t('Common.loading')}</p>;
	}

	if (groupsError || userError || !userData || userData.status !== 'success') {
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
				{userData.data.user.role === 'admin' && <AddGroupForm />}
			</div>

			<TabsContent value="all">
				<AllGroupsDataTable
					data={activeTab === 'all' ? tableData : []}
					page={page}
					setPage={setPage}
					rowsPerPage={rowsPerPage}
					setRowsPerPage={setRowsPerPage}
					total={groupsData?.total || 0}
					search={search}
					setSearch={setSearch}
					userData={userData}
				/>
			</TabsContent>

			<TabsContent value="my">
				<AllGroupsDataTable
					data={activeTab === 'my' ? tableData : []}
					page={page}
					setPage={setPage}
					rowsPerPage={rowsPerPage}
					setRowsPerPage={setRowsPerPage}
					total={groupsData?.total || 0}
					search={search}
					setSearch={setSearch}
					userData={userData}
				/>
			</TabsContent>
		</Tabs>
	);
}
