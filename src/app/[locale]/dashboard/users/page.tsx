'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getUsers, changeUserRole, User } from '@/features/dashboard/users/db/api';

export default function UsersDashboard() {
	const queryClient = useQueryClient();

	const { data: users, isLoading } = useQuery({
		queryKey: ['users'],
		queryFn: getUsers,
	});

	const mutation = useMutation({
		mutationFn: (id: string) => changeUserRole(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['users'] });
		},
	});

	if (isLoading) return <p className="text-center mt-10">Ładowanie...</p>;

	return (
		<div className="p-6">
			<h2 className="text-2xl font-bold mb-4">Lista użytkowników</h2>

			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
				{users?.map((user: User) => (
					<Card
						key={user._id}
						className="cursor-pointer hover:shadow-lg transition"
					>
						<CardHeader>
							<CardTitle>{user.mail}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<p>
								<span className="font-semibold">Rola:</span>{' '}
								<span
									className={`px-2 py-1 rounded text-white ${
										user.role === 'admin'
											? 'bg-blue-600'
											: 'bg-gray-500'
									}`}
								>
									{user.role}
								</span>
							</p>

							<p className="text-sm text-muted-foreground">
								Utworzony: {new Date(user.createdAt).toLocaleDateString()}
							</p>

							<Button
								onClick={() => mutation.mutate(user._id)}
								disabled={mutation.isPending}
								variant="outline"
								className="mt-2 w-full"
							>
								{mutation.isPending ? 'Zmiana...' : 'Zmień rolę'}
							</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
