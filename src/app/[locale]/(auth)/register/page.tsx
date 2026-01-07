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
import { SignupBodyRequest, signupRequest, signupRequestSchema } from '@/features/auth/SignUp';
import { SignupConfirmModal } from '@/features/auth/SignupConfirmModal';

const RegisterPage = () => {
	const t = useTranslations('RegisterPage');
	const router = useRouter();
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [email, setEmail] = useState('');

	const form = useForm<SignupBodyRequest>({
		defaultValues: {
			mail: '',
			password: '',
			repeatPassword: '',
		},
		resolver: zodResolver(signupRequestSchema),
	});

	const mutation = useMutation({
		mutationFn: signupRequest,
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

	const onSubmit = (data: SignupBodyRequest) => {
		mutation.mutate(data);
	};

	return (
		<>
			<div className="w-full h-full flex items-center justify-center">
				<div className="max-w-sm w-full flex flex-col items-center border rounded-lg p-6 shadow-sm">
					<p className="mt-4 text-xl font-bold tracking-tight py-8">{t('title')}</p>

					<Form {...form}>
						<form className="w-full space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
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
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('password')}</FormLabel>
										<FormControl>
											<Input type="password" placeholder={t('password')} className="w-full" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="repeatPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('second_password')}</FormLabel>
										<FormControl>
											<Input type="password" placeholder={t('second_password')} className="w-full" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="mt-4 w-full" disabled={mutation.isPending}>
								{mutation.isPending ? t('loading') : t('sign_up_button')}
							</Button>
						</form>
					</Form>
					<div className="mt-5 space-y-5">
						<p className="text-sm text-center">
							{t('has_account')}
							<Link href="/login" className="ml-1 underline text-muted-foreground">
								{t('login_button')}
							</Link>
						</p>
					</div>
				</div>
			</div>
			<SignupConfirmModal
				open={confirmOpen}
				onOpenChange={setConfirmOpen}
				email={email}
				onSuccess={() => router.push('/login')}
			/>
		</>
	);
};

export default RegisterPage;
