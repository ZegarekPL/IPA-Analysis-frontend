'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTranslations } from 'next-intl';

const formSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, 'Password must be at least 8 characters long'),
	repeatPassword: z.string().min(8, 'Password must be at least 8 characters long'),
});

const RegisterPage = () => {
	const t = useTranslations('RegisterPage');
	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			email: '',
			password: '',
			repeatPassword: '',
		},
		resolver: zodResolver(formSchema),
	});

	const onSubmit = (data: z.infer<typeof formSchema>) => {
		console.log(data);
	};

	return (
		<div className="w-full flex items-center justify-center">
			<div className="max-w-xs w-full flex flex-col items-center">
				<p className="mt-4 text-xl font-bold tracking-tight py-8">{t('title')}</p>

				<Form {...form}>
					<form className="w-full space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="email"
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
						<Button type="submit" className="mt-4 w-full">
							{t('sign_up_button')}
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
	);
};

export default RegisterPage;
