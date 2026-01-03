'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import {
	passwordResetConfirm,
	passwordResetConfirmSchema,
	PasswordResetBodyConfirm,
} from '@/features/auth/PasswordReset';
import { useEffect } from 'react';

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	email: string;
	onSuccess: () => void;
};

export const PasswordResetConfirmModal = ({ open, onOpenChange, email, onSuccess }: Props) => {
	const form = useForm<PasswordResetBodyConfirm>({
		resolver: zodResolver(passwordResetConfirmSchema),
		defaultValues: {
			mail: email,
			code: '',
			newPassword: '',
		},
	});

	useEffect(() => {
		if (email) {
			form.reset({
				mail: email,
				code: '',
			});
		}
	}, [email, form]);

	const mutation = useMutation({
		mutationFn: passwordResetConfirm,
		onSuccess: (response) => {
			toast.success(response.status, {
				description: response.message,
			});
			onSuccess();
		},
		onError: (error: any) => {
			toast.error('ERROR', {
				description: error?.response?.data?.message || 'Invalid code',
			});
		},
	});

	const onSubmit = (data: PasswordResetBodyConfirm) => {
		mutation.mutate(data);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Ustaw nowe hasło</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="code"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Kod weryfikacyjny</FormLabel>
									<FormControl>
										<Input placeholder="" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nowe hasło</FormLabel>
									<FormControl>
										<Input type="password" placeholder="" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="w-full" disabled={mutation.isPending}>
							{mutation.isPending ? 'Zapisywanie...' : 'Zmień hasło'}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};
