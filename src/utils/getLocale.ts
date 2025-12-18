import { Locale } from 'use-intl';

import { routing } from '@/i18n/routing';

export function getLocale(pathname: Locale): string {
	return pathname.split('/')[1] || routing.defaultLocale;
}
