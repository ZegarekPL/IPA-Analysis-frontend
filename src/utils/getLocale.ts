import { routing } from '@/i18n/routing';
import { Locale } from 'use-intl';

export function getLocale(pathname: Locale): string {
	return pathname.split('/')[1] || routing.defaultLocale;
}
