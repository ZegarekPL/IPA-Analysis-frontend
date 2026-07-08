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
						<Badge variant="secondary">{t('GroupPageClient.members')}: {data!.membersCount}</Badge>
						<Badge variant={data!.isMember ? 'default' : 'outline'}>
							{data!.isMember ? t('GroupPageClient.you_are_a_member') : t('GroupPageClient.you_are_not_a_member')}
						</Badge>
					</div>
					<div className="text-sm text-muted-foreground mt-2 space-y-1">
						<p>{t('GroupPageClient.create')}: {formatDate(data!.createdAt)}</p>
						<p>{t('GroupPageClient.update')}: {formatDate(data!.updatedAt)}</p>
					</div>
				</CardContent>
			</Card>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">{t('GroupPageClient.tests')}</h2>

				{data!.tests.length === 0 ? (
					<p className="text-muted-foreground">{t('GroupPageClient.no_tests')}</p>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t('GroupPageClient.test_name')}</TableHead>
								<TableHead>{t('GroupPageClient.test_assigned_at')}</TableHead>
								<TableHead>{t('GroupPageClient.test_start_time')}</TableHead>
								<TableHead>{t('GroupPageClient.test_end_time')}</TableHead>
								<TableHead className="text-right">{t('GroupPageClient.take_test')}</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{data!.tests.map((test: Tests, idx: number) => {
								const active = isTestActive(test.startsAt, test.endsAt);
								const testName = test.testName;
								const testId = test.testId;

								const slug = slugify(testName);
								return (
									<TableRow key={idx} className="">
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
													{t('GroupPageClient.unavailable')}
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
				<h2 className="text-xl font-semibold">{t('GroupPageClient.users')}</h2>

				{data!.members.length === 0 ? (
					<p className="text-muted-foreground">{t('GroupPageClient.no_users')}</p>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t('GroupPageClient.member_index')}</TableHead>
								<TableHead>{t('GroupPageClient.member_email')}</TableHead>
								<TableHead>{t('GroupPageClient.member_role')}</TableHead>
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
