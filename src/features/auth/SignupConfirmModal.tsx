'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogOverlay, DialogPortal, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SignupBodyConfirm, signupConfirm, signupConfirmSchema } from '@/features/auth/SignUp';

type Props = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	email: string;
	onSuccess: () => void;
};

export const SignupConfirmModal = ({ open, onOpenChange, email, onSuccess }: Props) => {
	const form = useForm<SignupBodyConfirm>({
		resolver: zodResolver(signupConfirmSchema),
		defaultValues: {
			mail: email,
			code: '',
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
		mutationFn: signupConfirm,
		onSuccess: (response) => {
			toast.success(response.status, { description: response.message });
			onSuccess();
		},
		onError: (error: any) => {
			toast.error('ERROR', { description: error?.response?.data?.message || 'Invalid code' });
		},
	});

	const onSubmit = (data: SignupBodyConfirm) => {
		console.log('Submitting:', data);
		mutation.mutate(data);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogPortal>
				<DialogOverlay className="fixed inset-0 z-50 bg-black/50" />
				<DialogContent className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg shadow-lg outline-none">
					<DialogHeader>
						<DialogTitle>Potwierdź email</DialogTitle>
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

							<Button type="submit" className="w-full" disabled={mutation.isPending}>
								{mutation.isPending ? 'Sprawdzanie...' : 'Potwierdź'}
							</Button>
						</form>
					</Form>
				</DialogContent>
			</DialogPortal>
		</Dialog>
	);
};
