'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { signupConfirm, signupConfirmSchema, SignupBodyConfirm } from '@/features/auth/SignUp';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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

	const mutation = useMutation({
		mutationFn: signupConfirm,
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

	const onSubmit = (data: SignupBodyConfirm) => {
		mutation.mutate(data);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
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
										<Input placeholder="123456" {...field} />
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
		</Dialog>
	);
};
