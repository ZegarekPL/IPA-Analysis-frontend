'use client';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';

import SubmitAnswerForm from '../answer/ui/Form/SubmitAnswerForm';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getGroupDetails, Tests, UserGroup } from '@/features/dashboard/groups/db/api';
import { formatDate } from '@/utils/formatDate';
import { getErrorMessage } from '@/utils/getErrorMessage';

interface Props {
	group: string;
}

export default function GroupPageClient({ group }: Props) {
	const id = group.split('-').at(-1)!;
	const t = useTranslations();
	const { data, isLoading, isError, error, refetch } = useQuery({
		queryKey: ['groups', id],
		queryFn: () => getGroupDetails(id),
	});

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
	console.log(data);
	return (
		<div className="p-6 max-w-5xl mx-auto space-y-6">
			<Card>
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl">{data!.name}</CardTitle>
					<CardDescription>{data!.description}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<div className="flex gap-4 flex-wrap">
						<Badge variant="secondary">Członkowie: {data!.membersCount}</Badge>
						<Badge variant={data!.isMember ? 'default' : 'outline'}>
							{data!.isMember ? 'Jesteś członkiem' : 'Nie jesteś członkiem'}
						</Badge>
					</div>
					<div className="text-sm text-muted-foreground mt-2 space-y-1">
						<p>Utworzono: {formatDate(data!.createdAt)}</p>
						<p>Aktualizacja: {formatDate(data!.updatedAt)}</p>
					</div>
				</CardContent>
			</Card>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Testy</h2>
				{data!.tests.length === 0 && <p className="text-muted-foreground">Brak przypisanych testów</p>}
				{data!.tests.map((test: Tests, idx: number) => (
					<Card key={idx}>
						<CardContent className="flex justify-between items-center">
							<div>
								<p className="font-medium">{test.testId}</p>
								<p className="text-sm text-muted-foreground">
									Przypisano: {formatDate(test.assignedAt)} | Rozpoczęcie: {formatDate(test.startsAt)} | Zakończenie:{' '}
									{formatDate(test.endsAt)}
								</p>
								<SubmitAnswerForm testId={test.testId} />
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Członkowie</h2>
				{data!.members.length === 0 && <p className="text-muted-foreground">Brak przypisanych członków</p>}
				{data!.members.map((member: UserGroup, idx: number) => (
					<Card key={idx}>
						<CardContent className="flex justify-between items-center">
							<div>
								<p className="font-medium">{member.index}</p>
								<p className="font-medium">{member.mail}</p>
								<p className="font-medium">{member.role}</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
