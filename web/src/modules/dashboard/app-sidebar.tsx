"use client";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
	Box,
	Clock,
	CreditCard,
	FileText,
	FolderOpen,
	HardDrive,
	Plus,
	Settings,
	Star,
	Trash2,
	Upload,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainItems = [
	{
		icon: <HardDrive className="h-4 w-4" />,
		label: "My Drive",
		href: "/dashboard/my",
	},
	{
		icon: <Users className="h-4 w-4" />,
		label: "Shared with me",
		href: "/dashboard/shared",
	},
	{
		icon: <Clock className="h-4 w-4" />,
		label: "Recent",
		href: "/dashboard/recent",
	},
	{
		icon: <Star className="h-4 w-4" />,
		label: "Starred",
		href: "/dashboard/starred",
	},
	{
		icon: <Trash2 className="h-4 w-4" />,
		label: "Trash",
		href: "/dashboard/trash",
	},
];

const quickItems = [
	{
		icon: <FolderOpen className="h-4 w-4" />,
		label: "Projects",
		href: "/dashboard/folder/projects",
	},
	{
		icon: <FileText className="h-4 w-4" />,
		label: "Documents",
		href: "/dashboard/folder/documents",
	},
];

const AppSidebar = () => {
	const pathname = usePathname();

	return (
		<Sidebar className="px-4">
			<SidebarHeader className="p-4">
				<div className="flex items-center gap-2 font-semibold text-lg">
					<Box className="h-6 w-6" />
					in-box
				</div>
			</SidebarHeader>

			<SidebarContent className="space-y-4">
				{/* Quick Actions */}
				<SidebarGroup>
					<div className="px-2 space-y-2">
						<Button className="w-full justify-start" size="sm">
							<Plus className="mr-2 h-4 w-4" />
							New
						</Button>
						<Button
							variant="outline"
							className="w-full justify-start"
							size="sm">
							<Upload className="mr-2 h-4 w-4" />
							Upload
						</Button>
					</div>
				</SidebarGroup>

				{/* Main Navigation */}
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{mainItems.map((item) => (
								<SidebarMenuItem key={item.label}>
									<SidebarMenuButton
										asChild
										isActive={pathname === item.href}
										className="px-3 py-2">
										<Link href={item.href}>
											{item.icon}
											<span>{item.label}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				{/* Quick Access */}
				<SidebarGroup>
					<SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground">
						Quick Access
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{quickItems.map((item) => (
								<SidebarMenuItem key={item.label}>
									<SidebarMenuButton
										asChild
										isActive={pathname === item.href}
										className="px-3 py-2">
										<Link href={item.href}>
											{item.icon}
											<span>{item.label}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="p-4 space-y-4">
				{/* Storage Usage */}
				<div className="space-y-2">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">Storage</span>
						<span className="font-medium">15 GB / 100 GB</span>
					</div>
					<Progress value={15} className="h-2" />
					<Button variant="outline" size="sm" className="w-full">
						Upgrade Storage
					</Button>
				</div>{" "}
				{/* Settings */}
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="/dashboard/billing">
								<CreditCard className="h-4 w-4" />
								<span>Billing</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarMenuButton asChild>
							<Link href="/dashboard/settings">
								<Settings className="h-4 w-4" />
								<span>Settings</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};

export default AppSidebar;
