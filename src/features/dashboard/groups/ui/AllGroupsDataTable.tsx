'use client';

import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState,
} from '@tanstack/react-table';
import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	MoreVertical,
	LayoutGrid,
	Search,
} from 'lucide-react';
import Link from 'next/link';
import { z } from 'zod';

import { joinGroup, leaveGroup } from '../db/api';
import DeleteGroupForm from './Form/DeleteGroupForm';
import EditGroupForm from './Form/EditGroupForm';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GetUserSuccessResponse } from '@/features/auth/Login';
import { slugify } from '@/utils/slugify';

export const schema = z.object({
	id: z.string(),
	header: z.string(),
	description: z.string(),
	isMember: z.boolean(),
	membersCount: z.string(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

interface AllGroupsDataTableProps {
	data: z.infer<typeof schema>[];
	page: number;
	setPage: (p: number) => void;
	rowsPerPage: number;
	setRowsPerPage: (r: number) => void;
	total: number;
	search: string;
	setSearch: (s: string) => void;
	userData: GetUserSuccessResponse;
}

export function AllGroupsDataTable({
	data,
	page,
	setPage,
	rowsPerPage,
	setRowsPerPage,
	total,
	search,
	setSearch,
	userData,
}: AllGroupsDataTableProps) {
	const [rowSelection, setRowSelection] = React.useState({});
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [inputValue, setInputValue] = React.useState(search || '');

	const queryClient = useQueryClient();

	const joinMutation = useMutation({
		mutationFn: joinGroup,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['groups'] });
		},
	});

	const leaveMutation = useMutation({
		mutationFn: leaveGroup,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['groups'] });
		},
	});

	const columns: ColumnDef<z.infer<typeof schema>>[] = React.useMemo(
		() => [
			{
				id: 'select',
				header: ({ table }) => (
					<div className="flex items-center justify-center">
						<Checkbox
							checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
							onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
							aria-label="Select all"
						/>
					</div>
				),
				cell: ({ row }) => (
					<div className="flex items-center justify-center">
						<Checkbox
							checked={row.getIsSelected()}
							onCheckedChange={(value) => row.toggleSelected(!!value)}
							aria-label="Select row"
						/>
					</div>
				),
				enableSorting: false,
				enableHiding: false,
			},
			{
				accessorKey: 'name',
				header: 'Name',
				cell: ({ row }) => {
					const groupName = row.original.header;
					const groupId = row.original.id;

					const slug = slugify(groupName);
					return (
						<Link href={`/dashboard/groups/${slug}-${groupId}`} className="text-primary hover:underline font-medium">
							<div className="truncate max-w-xs" title={groupName}>
								{groupName}
							</div>
						</Link>
					);
				},
				enableHiding: false,
			},
			{
				accessorKey: 'description',
				header: 'Description',
				cell: ({ row }) => {
					return (
						<div className="truncate max-w-xs" title={row.original.description}>
							{row.original.description}
						</div>
					);
				},
			},
			{
				accessorKey: 'members',
				header: 'Members',
				cell: ({ row }) => {
					return row.original.membersCount;
				},
			},
			{
				accessorKey: 'created At',
				header: 'Created At',
				cell: ({ row }) => {
					return row.original.createdAt;
				},
			},
			{
				accessorKey: 'updated At',
				header: 'Updated At',
				cell: ({ row }) => {
					return row.original.updatedAt;
				},
			},
			{
				id: 'actions',
				cell: ({ row }) => (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
								size="icon"
							>
								<MoreVertical />
								<span className="sr-only">Open menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-32">
							{userData.data.user.role === 'admin' && (
								<DropdownMenuItem asChild>
									<EditGroupForm
										group={{
											id: row.original.id,
											name: row.original.header,
											description: row.original.description,
										}}
									/>
								</DropdownMenuItem>
							)}
							<DropdownMenuItem
								onSelect={(e) => {
									e.preventDefault();
									if (row.original.isMember) {
										leaveMutation.mutate(row.original.id);
									} else {
										joinMutation.mutate(row.original.id);
									}
								}}
							>
								{row.original.isMember ? 'Leave' : 'Join'}
							</DropdownMenuItem>
							{userData.data.user.role === 'admin' && (
								<>
									<DropdownMenuSeparator />
									<DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
										<DeleteGroupForm
											group={{
												id: row.original.id,
												name: row.original.header,
												description: row.original.description,
											}}
										/>
									</DropdownMenuItem>
								</>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				),
			},
		],
		[userData],
	);

	const table = useReactTable({
		data,
		columns,
		state: {
			sorting,
			columnVisibility,
			rowSelection,
			columnFilters,
			pagination: {
				pageIndex: page - 1,
				pageSize: rowsPerPage,
			},
		},
		getRowId: (row) => row.id.toString(),
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<>
			<div className="flex items-center justify-between px-4 lg:px-6">
				<div className="flex items-center gap-2">
					<Input
						type="text"
						placeholder="Search..."
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === 'Enter') {
								setSearch(inputValue);
								setPage(1);
							}
						}}
						className="flex-1"
					/>
					<Button
						size="sm"
						onClick={() => {
							setSearch(inputValue);
							setPage(1);
						}}
					>
						<Search className="w-4 h-4" />
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="sm">
								<LayoutGrid />
								<span className="hidden lg:inline">Customize Columns</span>
								<span className="lg:hidden">Columns</span>
								<ChevronDown />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-56">
							{table
								.getAllColumns()
								.filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
								.map((column) => {
									return (
										<DropdownMenuCheckboxItem
											key={column.id}
											className="capitalize"
											checked={column.getIsVisible()}
											onCheckedChange={(value) => column.toggleVisibility(!!value)}
										>
											{column.id}
										</DropdownMenuCheckboxItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div className="flex flex-col gap-4 px-4 lg:px-6 pt-4">
				<div className="overflow-hidden rounded-lg border">
					<Table>
						<TableHeader className="bg-muted sticky top-0 z-10">
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id} colSpan={header.colSpan}>
												{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody className="**:data-[slot=table-cell]:first:w-8">
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={columns.length} className="h-24 text-center">
										No results.
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-between px-4">
					<div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
						{table.getFilteredSelectedRowModel().rows.length} of {total} row(s) selected.
					</div>
					<div className="flex w-full items-center gap-8 lg:w-fit">
						<div className="hidden items-center gap-2 lg:flex">
							<Label htmlFor="rows-per-page" className="text-sm font-medium">
								Rows per page
							</Label>
							<Select
								value={rowsPerPage.toString()}
								onValueChange={(value) => {
									setRowsPerPage(Number(value));
									setPage(1);
								}}
							>
								<SelectTrigger size="sm" className="w-20" id="rows-per-page">
									<SelectValue placeholder={rowsPerPage.toString()} />
								</SelectTrigger>
								<SelectContent side="top">
									{[10, 20, 30, 40, 50].map((n) => (
										<SelectItem key={n} value={n.toString()}>
											{n}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="flex w-fit items-center justify-center text-sm font-medium">
							Page {page} of {Math.ceil(total / rowsPerPage)}
						</div>

						<div className="ml-auto flex items-center gap-2 lg:ml-0">
							<Button
								variant="outline"
								className="hidden h-8 w-8 p-0 lg:flex"
								onClick={() => setPage(1)}
								disabled={page === 1}
							>
								<span className="sr-only">Go to first page</span>
								<ChevronsLeft />
							</Button>
							<Button
								variant="outline"
								className="size-8"
								size="icon"
								onClick={() => setPage(page - 1)}
								disabled={page === 1}
							>
								<span className="sr-only">Go to previous page</span>
								<ChevronLeft />
							</Button>
							<Button
								variant="outline"
								className="size-8"
								size="icon"
								onClick={() => setPage(page + 1)}
								disabled={page === Math.ceil(total / rowsPerPage)}
							>
								<span className="sr-only">Go to next page</span>
								<ChevronRight />
							</Button>
							<Button
								variant="outline"
								className="hidden size-8 lg:flex"
								size="icon"
								onClick={() => setPage(Math.ceil(total / rowsPerPage))}
								disabled={page === Math.ceil(total / rowsPerPage)}
							>
								<span className="sr-only">Go to last page</span>
								<ChevronsRight />
							</Button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

