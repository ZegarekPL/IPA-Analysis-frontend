'use client';

import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { getUser } from '@/features/auth/Login';
import { routing } from '@/i18n/routing';

export default function UserPage() {
	const t = useTranslations();
	const pathname = usePathname();
	const { theme } = useTheme();
	const { data, isLoading, isError } = useQuery({
		queryKey: ['getUser'],
		queryFn: getUser,
	});

	if (isLoading) {
		return <p className="text-center mt-10">{t('Common.loading')}</p>;
	}

	if (isError || !data || data.status !== 'success') {
		return <p className="text-center mt-10 text-destructive">{t('UserPage.error')}</p>;
	}

	const user = data.data.user;

	const initials = user.index ? user.index.split('@')[0].toUpperCase() : 'U';

	const locale = pathname.split('/')[1] || routing.defaultLocale;
	const languageLabel = t('Language.' + locale);
	const themeLabel = t('Theme.' + theme);

	return (
		<div className="w-full flex items-center justify-center px-6 py-10">
			<Card className="w-full max-w-2xl">
				<CardHeader className="flex flex-col items-center gap-4">
					<Avatar className="h-24 w-24">
						<AvatarImage src={''} alt={user.index} />
						<AvatarFallback>{initials}</AvatarFallback>
					</Avatar>

					<div className="text-center">
						<CardTitle className="text-2xl">{user.index}</CardTitle>
						<p className="text-sm text-muted-foreground">{user.mail}</p>
						<Badge variant="outline" className="mt-2 capitalize">
							{t('Roles.' + user.role)}
						</Badge>
					</div>
				</CardHeader>

				<Separator />

				<CardContent className="space-y-6 mt-6">
					<section>
						<h3 className="text-lg font-semibold mb-3">{t('UserPage.profile_information')}</h3>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-1">
								<Label htmlFor="name">{t('UserPage.username')}</Label>
								<Input id="name" value={user.index} readOnly />
							</div>
							<div className="space-y-1">
								<Label htmlFor="email">{t('UserPage.email')}</Label>
								<Input id="email" value={user.mail} readOnly />
							</div>
						</div>
					</section>

					<section>
						<h3 className="text-lg font-semibold mb-3">{t('UserPage.account_details')}</h3>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-1">
								<Label htmlFor="created">{t('UserPage.created_at')}</Label>
								<Input id="created" value={new Date(user.createdAt).toLocaleString()} readOnly />
							</div>
							<div className="space-y-1">
								<Label htmlFor="updated">{t('UserPage.last_updated')}</Label>
								<Input id="updated" value={new Date(user.updatedAt).toLocaleString()} readOnly />
							</div>
						</div>
					</section>

					<section>
						<h3 className="text-lg font-semibold mb-3">{t('UserPage.settings')}</h3>
						<div className="grid gap-4 md:grid-cols-2">
							<div className="space-y-1">
								<Label htmlFor="language">{t('UserPage.preferred_language')}</Label>
								<Input id="language" value={languageLabel} readOnly />
							</div>
							<div className="space-y-1">
								<Label htmlFor="theme">{t('UserPage.preferred_theme')}</Label>
								<Input id="theme" value={themeLabel} readOnly />
							</div>
						</div>
					</section>
				</CardContent>
			</Card>
		</div>
	);
}
