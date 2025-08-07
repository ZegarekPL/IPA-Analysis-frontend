'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { routing } from '@/i18n/routing';
import { Globe } from 'lucide-react';

export default function LocaleSelector() {
	const t = useTranslations('LocaleSelector');
	const pathname = usePathname();
	const router = useRouter();
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [isPending, startTransition] = useTransition();

	const currentLocale = pathname.split('/')[1] || routing.defaultLocale;

	const handleLocaleChange = (locale: string) => {
		const segments = pathname.split('/');
		segments[1] = locale;
		const newPath = segments.join('/');

		startTransition(() => {
			router.push(newPath);
		});
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Globe className="h-[1.2rem] w-[1.2rem]" />
					<span className="sr-only">{t('change_language')}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{routing.locales.map((locale) => (
					<DropdownMenuItem
						key={locale}
						onClick={() => handleLocaleChange(locale)}
						className={locale === currentLocale ? 'font-semibold' : ''}
					>
						{locale.toUpperCase()}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
