'use client';

import { Fragment } from 'react/jsx-runtime';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export default function DynamicBreadcrumb() {
	const pathname = usePathname();
	const t = useTranslations('Sidebar');

	const segments = pathname.split('/').filter(Boolean).slice(1);

	const locale = pathname.split('/')[1];

	const buildHref = (i: number) => `/${locale}/${segments.slice(0, i + 1).join('/')}`;

	const formatLabel = (str: string) => {
		const withoutId = str.replace(/-[a-f0-9]{24}$/i, '');
		const key = withoutId.replace(/-/g, '_');
		return t.has(key) ? t(key) : withoutId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	};

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{segments.map((segment, i) => {
					const isLast = i === segments.length - 1;

					return (
						<Fragment key={i}>
							<BreadcrumbItem>
								{!isLast ? (
									<BreadcrumbLink href={buildHref(i)}>{formatLabel(segment)}</BreadcrumbLink>
								) : (
									<BreadcrumbPage>{formatLabel(segment)}</BreadcrumbPage>
								)}
							</BreadcrumbItem>

							{!isLast && <BreadcrumbSeparator />}
						</Fragment>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
