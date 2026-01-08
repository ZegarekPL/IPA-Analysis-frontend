'use client';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import SubmitAnswerForm from '../answer/ui/Form/SubmitAnswerForm';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getGroupDetails, Tests, UserGroup } from '@/features/dashboard/groups/db/api';
import { formatDate } from '@/utils/formatDate';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { slugify } from '@/utils/slugify';

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

	const isTestActive = (startsAt: string | Date, endsAt: string | Date) => {
		const now = new Date().getTime();
		return now >= new Date(startsAt).getTime() && now <= new Date(endsAt).getTime();
	};

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

				{data!.tests.length === 0 ? (
					<p className="text-muted-foreground">Brak przypisanych testów</p>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>ID testu</TableHead>
								<TableHead>Przypisano</TableHead>
								<TableHead>Rozpoczęcie</TableHead>
								<TableHead>Zakończenie</TableHead>
								<TableHead className="text-right">Rozwiąż test</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{data!.tests.map((test: Tests, idx: number) => {
								const active = isTestActive(test.startsAt, test.endsAt);
								const testName = test.testId;
								const testId = test.testId;

								const slug = slugify(testName);
								return (
									<TableRow key={idx}>
										<TableCell className="font-medium">
											<Link
												href={`/dashboard/tests/${slug}-${testId}`}
												className="text-primary hover:underline font-medium"
											>
												<div className="truncate max-w-xs" title={testName}>
													{testName}
												</div>
											</Link>
										</TableCell>

										<TableCell>{formatDate(test.assignedAt)}</TableCell>
										<TableCell>{formatDate(test.startsAt)}</TableCell>
										<TableCell>{formatDate(test.endsAt)}</TableCell>

										<TableCell className="text-right">
											{active ? (
												<SubmitAnswerForm testId={test.testId} />
											) : (
												<Button disabled variant="secondary">
													Niedostępny
												</Button>
											)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				)}
			</div>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Członkowie</h2>

				{data!.members.length === 0 ? (
					<p className="text-muted-foreground">Brak przypisanych członków</p>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Indeks</TableHead>
								<TableHead>Email</TableHead>
								<TableHead>Rola</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{data!.members.map((member: UserGroup, idx: number) => (
								<TableRow key={idx}>
									<TableCell className="font-medium">{member.index}</TableCell>
									<TableCell>{member.mail}</TableCell>
									<TableCell>{member.role}</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
			</div>
		</div>
	);
}
