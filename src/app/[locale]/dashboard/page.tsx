'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTemplates, deleteTemplate, updateTemplate, createTemplates, Templates, CreateTemplates } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';
import TemplateForm from '@/components/admin/TemplatesForm';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

export default function TemplatesDashboard() {
	const queryClient = useQueryClient();
	const [selected, setSelected] = useState<Templates | null>(null);
	const [editing, setEditing] = useState<boolean>(false);
	const [creating, setCreating] = useState<boolean>(false);

	const { data, isLoading } = useQuery({
		queryKey: ['templates'],
		queryFn: getTemplates,
	});

	const deleteMutation = useMutation({
		mutationFn: (id: string) => deleteTemplate(id),
		onSuccess: () => queryClient.invalidateQueries(['templates']),
	});

	const createMutation = useMutation({
		mutationFn: (form: CreateTemplates) => createTemplates(form),
		onSuccess: () => {
			queryClient.invalidateQueries(['templates']);
			setCreating(false);
		},
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: CreateTemplates }) => updateTemplate(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries(['templates']);
			setEditing(false);
			setSelected(null);
		},
	});

	if (isLoading) return <p className="text-center mt-10">Ładowanie...</p>;

	return (
		<div className="p-6 relative">
			{/* Dashboard */}
			<div className={`${editing || creating ? 'blur-sm pointer-events-none' : ''}`}>
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-2xl font-bold">Templatki</h1>
					<Button onClick={() => setCreating(true)}>
						<PlusCircle className="mr-2 h-5 w-5" /> Nowa
					</Button>
				</div>
				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
					{data?.map((template: Templates) => (
						<Card
							key={template.name}
							className="cursor-pointer hover:shadow-lg transition"
							onClick={() => setSelected(template)}
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

			{/* AlertDialog jako modal edycji/tworzenia */}
			<AlertDialog
				open={editing || creating}
				onOpenChange={(open) => {
					if (!open) {
						setEditing(false);
						setCreating(false);
						setSelected(null);
					}
				}}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{editing ? 'Edytuj szablon' : 'Nowy szablon'}</AlertDialogTitle>
					</AlertDialogHeader>
					<TemplateForm
						initialData={editing ? selected! : undefined}
						onSubmit={(form: any) => {
							if (editing && selected) {
								updateMutation.mutate({ id: selected.id, data: form });
							} else {
								createMutation.mutate(form);
							}
						}}
						onCancel={() => {
							setEditing(false);
							setCreating(false);
							setSelected(null);
						}}
					/>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
