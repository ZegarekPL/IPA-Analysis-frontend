'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	PasswordResetBodyRequest,
	passwordResetRequest,
	passwordResetRequestSchema,
} from '@/features/auth/PasswordReset';
import { PasswordResetConfirmModal } from '@/features/auth/PasswordResetConfirmModal';

const PasswordResetPage = () => {
	const t = useTranslations('PasswordResetPage');
	const router = useRouter();
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [email, setEmail] = useState('');

	const form = useForm<PasswordResetBodyRequest>({
		resolver: zodResolver(passwordResetRequestSchema),
		defaultValues: {
			mail: '',
		},
	});

	const mutation = useMutation({
		mutationFn: passwordResetRequest,
		onSuccess: () => {
			toast.success('Kod wysłany', {
				description: 'Sprawdź swoją skrzynkę mailową',
			});
			setEmail(form.getValues('mail'));
			setConfirmOpen(true);
		},
		onError: (error: any) => {
			toast.error('ERROR', {
				description: error?.response?.data?.message || 'Unexpected error',
			});
		},
	});

	const onSubmit = (data: PasswordResetBodyRequest) => {
		mutation.mutate(data);
	};

	return (
		<>
			<div className="w-full h-full flex items-center justify-center">
				<div className="max-w-sm w-full border rounded-lg p-6 shadow-sm">
					<p className="text-xl font-bold text-center py-8">{t('title')}</p>

					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="mail"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('email')}</FormLabel>
										<FormControl>
											<Input type="email" placeholder={t('email')} className="w-full" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<Button type="submit" className="w-full" disabled={mutation.isPending}>
								{mutation.isPending ? 'Wysyłanie...' : 'Wyślij kod'}
							</Button>
						</form>
					</Form>
					<div className="mt-5 space-y-5">
						<Link href="/login" className="text-sm block underline text-muted-foreground text-center">
							{t('back_to_login')}
						</Link>
					</div>
				</div>
			</div>

			<PasswordResetConfirmModal
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				email={email}
				onSuccess={() => router.push('/login')}
			/>
		</>
	);
};

export default PasswordResetPage;
