'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronsUpDown, LogIn, LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { getUser } from '@/features/auth/Login';
import { logout } from '@/features/auth/Logout';

export function NavUser() {
	const { isMobile } = useSidebar();
	const queryClient = useQueryClient();
	const router = useRouter();

	const { data, isLoading, isError } = useQuery({
		queryKey: ['getUser'],
		queryFn: getUser,
		retry: false,
	});

	if (isLoading) {
		return <p className="text-center mt-10">Ładowanie...</p>;
	}

	if (isError || !data || data.status !== 'success') {
		return (
			<SidebarMenu>
				<SidebarMenuItem>
					<SidebarMenuButton asChild size="lg">
						<Link href="/login" className="flex items-center gap-2">
							<LogIn className="h-4 w-4" />
							<span>Zaloguj się</span>
						</Link>
					</SidebarMenuButton>
				</SidebarMenuItem>
			</SidebarMenu>
		);
	}

	const user = data.data.user;

	const initials = user.index
		? user.index
				.split(' ')
				.map((n) => n[0])
				.join('')
				.toUpperCase()
		: 'U';

	const handleLogout = async () => {
		try {
			await logout();
			queryClient.removeQueries({ queryKey: ['getUser'] });
			router.push('/');
			router.refresh();
		} catch (error) {
			console.error('Logout failed', error);
		}
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage src={''} alt={user.index} />
								<AvatarFallback>{initials}</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.index}</span>
								<span className="truncate text-xs">{user.mail}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? 'bottom' : 'right'}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage src={user.index} alt={user.index} />
									<AvatarFallback>{initials}</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user.index}</span>
									<span className="truncate text-xs">{user.mail}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem asChild>
								<Link href="/user">
									<User className="h-4 w-4" />
									Account
								</Link>
							</DropdownMenuItem>

							<DropdownMenuItem asChild>
								<Link href="/settings">
									<Settings className="h-4 w-4" />
									Settings
								</Link>
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={handleLogout}>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
