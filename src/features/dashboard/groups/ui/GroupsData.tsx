'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';

import { AllGroupsDataTable } from './AllGroupsDataTable';
import AddGroupForm from './Form/AddGroupForm';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllGroups, getMyGroups } from '@/features/dashboard/groups/db/api';
import { formatDate } from '@/utils/formatDate';

export function GroupsTabs() {
	const [activeTab, setActiveTab] = React.useState<'all' | 'my'>('all');

	const { data, isLoading } = useQuery({
		queryKey: [activeTab, 'groups'],
		queryFn: activeTab === 'all' ? getAllGroups : getMyGroups,
	});

	const tableData = React.useMemo(() => {
		return (
			data?.map((g: any) => ({
				id: g._id,
				header: g.name,
				description: g.description,
				membersCount: g.membersCount.toString(),
				createdAt: formatDate(g.createdAt),
				updatedAt: formatDate(g.updatedAt),
			})) ?? []
		);
	}, [data]);

	if (isLoading) return <p className="text-center mt-10">Ładowanie...</p>;

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
				<AllGroupsDataTable data={activeTab === 'all' ? tableData : []} />
			</TabsContent>

			<TabsContent value="my">
				<AllGroupsDataTable data={activeTab === 'my' ? tableData : []} />
			</TabsContent>
		</Tabs>
	);
}
