'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { login, SigninBody, signinSchema } from '@/features/auth/Login';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
	const t = useTranslations('LoginPage');
	const router = useRouter();
	const form = useForm<SigninBody>({
		defaultValues: {
			mail: '',
			password: '',
		},
		resolver: zodResolver(signinSchema),
	});

	const mutation = useMutation({
		mutationFn: login,
		onSuccess: () => {
			toast.success('SUCCESS', {
				description: t('success'),
			});
			router.push('/user');
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		onError: (error: any) => {
			toast.error('ERROR', {
				description: error?.response?.data?.message || 'Unexpected error',
			});
		},
	});

	const onSubmit = (data: SigninBody) => {
		mutation.mutate(data);
	};

	return (
		<div className="w-full flex items-center justify-center">
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
						<Button type="submit" className="mt-4 w-full" disabled={mutation.isPending}>
							{mutation.isPending ? t('loading') : t('sign_in_button')}
						</Button>
					</form>
				</Form>

				<div className="mt-5 space-y-5">
					<Link href="#" className="text-sm block underline text-muted-foreground text-center">
						{t('forgot_password')}
					</Link>
					<p className="text-sm text-center">
						{t('no_account')}
						<Link href="/register" className="ml-1 underline text-muted-foreground">
							{t('register_button')}
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
