'use client';
import { useQuery } from '@tanstack/react-query';
import { getGroupDetails, GroupDetails, Tests } from '@/features/dashboard/groups/db/api';
import { formatDate } from '@/utils/formatDate';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Props {
	group: string;
}

export default function GroupPageClient({ group }: Props) {
	const id = group.split('-').at(-1)!;

	const { data, isLoading, isError } = useQuery<GroupDetails>({
		queryKey: ['groups', id],
		queryFn: () => getGroupDetails(id),
	});

	if (isLoading) return <p className="text-center mt-10">Ładowanie...</p>;
	if (isError || !data) return <p className="text-center mt-10">Nie znaleziono grupy</p>;

	return (
		<div className="p-6 max-w-5xl mx-auto space-y-6">
			<Card>
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl">{data.name}</CardTitle>
					<CardDescription>{data.description}</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<div className="flex gap-4 flex-wrap">
						<Badge variant="secondary">Członkowie: {data.membersCount}</Badge>
						<Badge variant={data.isMember ? 'default' : 'outline'}>
							{data.isMember ? 'Jesteś członkiem' : 'Nie jesteś członkiem'}
						</Badge>
					</div>
					<div className="text-sm text-muted-foreground mt-2 space-y-1">
						<p>Utworzono: {formatDate(data.createdAt)}</p>
						<p>Aktualizacja: {formatDate(data.updatedAt)}</p>
					</div>
				</CardContent>
			</Card>

			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Testy</h2>
				{data.tests.length === 0 && <p className="text-muted-foreground">Brak przypisanych testów</p>}
				{data.tests.map((test: Tests, idx: number) => (
					<Card key={idx}>
						<CardContent className="flex justify-between items-center">
							<div>
								<p className="font-medium">{test.test}</p>
								<p className="text-sm text-muted-foreground">
									Przypisano: {formatDate(test.assignedAt)} | Termin: {formatDate(test.dueAt)}
								</p>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
