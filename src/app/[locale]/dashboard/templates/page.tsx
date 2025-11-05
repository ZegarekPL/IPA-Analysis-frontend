'use client';

import { useQuery } from '@tanstack/react-query';
import { getTemplates, Templates } from '@/features/dashboard/templates/db/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TemplatesDashboard() {
	const { data, isLoading } = useQuery({
		queryKey: ['templates'],
		queryFn: getTemplates,
	});

	if (isLoading) return <p className="text-center mt-10">Ładowanie...</p>;

	return (
		<div className="p-6 relative">
			<div>
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
					{data?.map((template: Templates) => (
						<Card
							key={template._id}
							className="cursor-pointer hover:shadow-lg transition"
						>
							<CardHeader>
								<CardTitle>{template.name}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
}
