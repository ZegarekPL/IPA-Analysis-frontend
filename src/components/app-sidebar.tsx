'use client';

import * as React from 'react';
import { BookCheck, LayoutTemplate, SquareTerminal, User, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { NavFolder } from './nav-folder';
import { NavMain } from './nav-main';

import { NavProjects } from '@/components/nav-projects';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from '@/components/ui/sidebar';

const data = {
	projects: [
		{
			name: 'Users',
			url: '/dashboard/users',
			icon: User,
		},
		{
			name: 'Groups',
			url: '/dashboard/groups',
			icon: Users,
		},
		{
			name: 'Templates',
			url: '/dashboard/templates',
			icon: LayoutTemplate,
		},
		{
			name: 'Tests',
			url: '/dashboard/tests',
			icon: BookCheck,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<Link href={`/`} className="w-full flex items-center justify-center py-2">
					<Image src="/next.svg" alt="Logo" width={100} height={24} className="dark:invert" />
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<NavMain projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
