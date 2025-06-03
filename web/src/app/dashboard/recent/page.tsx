"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Search,
	Clock,
	Filter,
	MoreHorizontal,
	File,
	Folder,
	Image,
	FileText,
	Video,
	Music,
	Archive,
	Star,
	Share2,
	Trash2,
	Download,
	Eye,
	Calendar,
} from "lucide-react";

interface RecentFile {
	id: string;
	name: string;
	type: "file" | "folder";
	fileType?: "image" | "document" | "video" | "audio" | "archive" | "other";
	size?: string;
	lastOpened: string;
	location: string;
	starred?: boolean;
	shared?: boolean;
}

const RecentPage = () => {
	const [searchQuery, setSearchQuery] = useState("");

	// Mock data for recent files
	const recentFiles: RecentFile[] = [
		{
			id: "1",
			name: "Q4-budget-final.xlsx",
			type: "file",
			fileType: "document",
			size: "2.1 MB",
			lastOpened: "2 minutes ago",
			location: "Documents/Finance",
			starred: true,
		},
		{
			id: "2",
			name: "team-meeting-notes.docx",
			type: "file",
			fileType: "document",
			size: "156 KB",
			lastOpened: "1 hour ago",
			location: "Documents/Meetings",
		},
		{
			id: "3",
			name: "project-wireframes.png",
			type: "file",
			fileType: "image",
			size: "3.2 MB",
			lastOpened: "3 hours ago",
			location: "Projects/Design",
			shared: true,
		},
		{
			id: "4",
			name: "vacation-video.mp4",
			type: "file",
			fileType: "video",
			size: "125 MB",
			lastOpened: "Yesterday",
			location: "Personal/Videos",
		},
		{
			id: "5",
			name: "Client Presentations",
			type: "folder",
			lastOpened: "2 days ago",
			location: "Work/Presentations",
			starred: true,
		},
		{
			id: "6",
			name: "backup-files.zip",
			type: "file",
			fileType: "archive",
			size: "45 MB",
			lastOpened: "3 days ago",
			location: "Backups",
		},
		{
			id: "7",
			name: "soundtrack.mp3",
			type: "file",
			fileType: "audio",
			size: "8.5 MB",
			lastOpened: "1 week ago",
			location: "Music/Favorites",
		},
	];

	const getFileIcon = (item: RecentFile) => {
		if (item.type === "folder")
			return <Folder className="h-5 w-5 text-blue-500" />;

		switch (item.fileType) {
			case "image":
				return <Image className="h-5 w-5 text-green-500" />;
			case "document":
				return <FileText className="h-5 w-5 text-blue-600" />;
			case "video":
				return <Video className="h-5 w-5 text-purple-500" />;
			case "audio":
				return <Music className="h-5 w-5 text-orange-500" />;
			case "archive":
				return <Archive className="h-5 w-5 text-yellow-600" />;
			default:
				return <File className="h-5 w-5 text-gray-500" />;
		}
	};

	const filteredFiles = recentFiles.filter(
		(file) =>
			file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			file.location.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="flex-1 space-y-6 p-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<Clock className="h-8 w-8 text-green-600" />
						Recent
					</h1>
					<p className="text-muted-foreground">
						Files and folders you've opened recently
					</p>
				</div>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<Clock className="h-5 w-5 text-blue-500" />
							<div>
								<p className="text-2xl font-bold">
									{recentFiles.length}
								</p>
								<p className="text-sm text-muted-foreground">
									Recent items
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<FileText className="h-5 w-5 text-green-500" />
							<div>
								<p className="text-2xl font-bold">
									{
										recentFiles.filter(
											(f) => f.type === "file"
										).length
									}
								</p>
								<p className="text-sm text-muted-foreground">
									Files
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<Folder className="h-5 w-5 text-yellow-500" />
							<div>
								<p className="text-2xl font-bold">
									{
										recentFiles.filter(
											(f) => f.type === "folder"
										).length
									}
								</p>
								<p className="text-sm text-muted-foreground">
									Folders
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<Star className="h-5 w-5 text-orange-500" />
							<div>
								<p className="text-2xl font-bold">
									{
										recentFiles.filter((f) => f.starred)
											.length
									}
								</p>
								<p className="text-sm text-muted-foreground">
									Starred
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Search */}
			<div className="flex items-center gap-4">
				<div className="relative flex-1 max-w-md">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search recent files..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-8"
					/>
				</div>
				<Button variant="outline" size="icon">
					<Filter className="h-4 w-4" />
				</Button>
			</div>

			{/* Files Table */}
			<Card>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Last opened</TableHead>
							<TableHead>Location</TableHead>
							<TableHead>Size</TableHead>
							<TableHead className="w-12"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{filteredFiles.map((file) => (
							<TableRow
								key={file.id}
								className="cursor-pointer hover:bg-muted/50">
								<TableCell>
									<div className="flex items-center gap-3">
										{getFileIcon(file)}
										<span className="font-medium">
											{file.name}
										</span>
										<div className="flex items-center gap-1">
											{file.starred && (
												<Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
											)}
											{file.shared && (
												<Badge
													variant="secondary"
													className="text-xs">
													Shared
												</Badge>
											)}
										</div>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<Calendar className="h-3 w-3 text-muted-foreground" />
										{file.lastOpened}
									</div>
								</TableCell>
								<TableCell>
									<span className="text-sm text-muted-foreground">
										{file.location}
									</span>
								</TableCell>
								<TableCell>{file.size || "—"}</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8">
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem>
												<Eye className="mr-2 h-4 w-4" />
												Preview
											</DropdownMenuItem>
											<DropdownMenuItem>
												<Download className="mr-2 h-4 w-4" />
												Download
											</DropdownMenuItem>
											<DropdownMenuItem>
												<Share2 className="mr-2 h-4 w-4" />
												Share
											</DropdownMenuItem>
											<DropdownMenuItem>
												<Star className="mr-2 h-4 w-4" />
												{file.starred
													? "Unstar"
													: "Star"}
											</DropdownMenuItem>
											<DropdownMenuItem className="text-red-600">
												<Trash2 className="mr-2 h-4 w-4" />
												Move to trash
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</Card>

			{/* Empty State */}
			{filteredFiles.length === 0 && (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<Clock className="h-12 w-12 text-muted-foreground mb-4" />
						<CardTitle className="mb-2">
							No recent files found
						</CardTitle>
						<CardDescription className="text-center">
							{searchQuery
								? "Try adjusting your search terms"
								: "Start working with files to see them here"}
						</CardDescription>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default RecentPage;
