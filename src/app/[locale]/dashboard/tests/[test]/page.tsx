import { use } from 'react';

import TestPageClient from '@/features/dashboard/test/TestPageClient';

export default function GroupPage({ params }: { params: Promise<{ locale: string; test: string }> }) {
	const { test } = use(params);

	return <TestPageClient test={test} />;
}
