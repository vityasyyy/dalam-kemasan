"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Search,
	Upload,
	FolderPlus,
	Grid3X3,
	List,
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
	HardDrive,
} from "lucide-react";

interface FileItem {
	id: string;
	name: string;
	type: "file" | "folder";
	fileType?: "image" | "document" | "video" | "audio" | "archive" | "other";
	size?: string;
	modified: string;
	shared?: boolean;
	starred?: boolean;
}

const DashboardHomePage = () => {
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [searchQuery, setSearchQuery] = useState("");

	// Mock data
	const files: FileItem[] = [
		{
			id: "1",
			name: "Projects",
			type: "folder",
			modified: "2 days ago",
			starred: true,
		},
		{ id: "2", name: "Documents", type: "folder", modified: "1 week ago" },
		{
			id: "3",
			name: "vacation-photos.zip",
			type: "file",
			fileType: "archive",
			size: "125 MB",
			modified: "3 days ago",
			shared: true,
		},
		{
			id: "4",
			name: "presentation.pptx",
			type: "file",
			fileType: "document",
			size: "8.5 MB",
			modified: "1 day ago",
			starred: true,
		},
		{
			id: "5",
			name: "video-call-recording.mp4",
			type: "file",
			fileType: "video",
			size: "250 MB",
			modified: "5 hours ago",
		},
		{
			id: "6",
			name: "profile-picture.jpg",
			type: "file",
			fileType: "image",
			size: "2.1 MB",
			modified: "2 weeks ago",
		},
		{
			id: "7",
			name: "Music Collection",
			type: "folder",
			modified: "1 month ago",
		},
		{
			id: "8",
			name: "budget-2025.xlsx",
			type: "file",
			fileType: "document",
			size: "156 KB",
			modified: "4 days ago",
		},
	];

	const recentFiles = files.filter((f) => f.type === "file").slice(0, 4);

	const getFileIcon = (item: FileItem) => {
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

	const filteredFiles = files.filter((file) =>
		file.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="flex-1 space-y-6 p-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">My Drive</h1>
					<p className="text-muted-foreground">
						Manage and organize your files
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Dialog>
						<DialogTrigger asChild>
							<Button>
								<Upload className="mr-2 h-4 w-4" />
								Upload
							</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>Upload Files</DialogTitle>
								<DialogDescription>
									Drag and drop files here or click to browse
								</DialogDescription>
							</DialogHeader>
							<div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
								<Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
								<p className="text-sm text-gray-600">
									Choose files to upload
								</p>
							</div>
						</DialogContent>
					</Dialog>

					<Button variant="outline">
						<FolderPlus className="mr-2 h-4 w-4" />
						New Folder
					</Button>
				</div>
			</div>

			{/* Storage Info */}
			<Card>
				<CardContent className="pt-6">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-3">
							<HardDrive className="h-5 w-5 text-blue-500" />
							<div>
								<p className="font-medium">Storage Usage</p>
								<p className="text-sm text-muted-foreground">
									15 GB of 100 GB used
								</p>
							</div>
						</div>
						<Button variant="outline" size="sm">
							Upgrade
						</Button>
					</div>
					<Progress value={15} className="h-2" />
				</CardContent>
			</Card>

			{/* Quick Access */}
			<div>
				<h2 className="text-xl font-semibold mb-4">Quick Access</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
					{recentFiles.map((file) => (
						<Card
							key={file.id}
							className="hover:shadow-md transition-shadow cursor-pointer">
							<CardContent className="p-4">
								<div className="flex items-center gap-3">
									{getFileIcon(file)}
									<div className="flex-1 min-w-0">
										<p className="font-medium truncate">
											{file.name}
										</p>
										<p className="text-sm text-muted-foreground">
											{file.modified}
										</p>
									</div>
									{file.starred && (
										<Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
									)}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>

			{/* Search and Controls */}
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-2 flex-1">
					<div className="relative flex-1 max-w-md">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search files and folders..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="pl-8"
						/>
					</div>
					<Button variant="outline" size="icon">
						<Filter className="h-4 w-4" />
					</Button>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant={viewMode === "grid" ? "default" : "outline"}
						size="icon"
						onClick={() => setViewMode("grid")}>
						<Grid3X3 className="h-4 w-4" />
					</Button>
					<Button
						variant={viewMode === "list" ? "default" : "outline"}
						size="icon"
						onClick={() => setViewMode("list")}>
						<List className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Files Display */}
			{viewMode === "grid" ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
					{filteredFiles.map((file) => (
						<Card
							key={file.id}
							className="group hover:shadow-md transition-all cursor-pointer">
							<CardContent className="p-4">
								<div className="flex flex-col items-center text-center space-y-3">
									<div className="relative">
										{getFileIcon(file)}
										{file.shared && (
											<Share2 className="absolute -top-1 -right-1 h-3 w-3 text-blue-500" />
										)}
									</div>

									<div className="w-full">
										<p
											className="font-medium truncate"
											title={file.name}>
											{file.name}
										</p>
										{file.size && (
											<p className="text-xs text-muted-foreground">
												{file.size}
											</p>
										)}
										<p className="text-xs text-muted-foreground">
											{file.modified}
										</p>
									</div>

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

									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8">
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
												Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			) : (
				<Card>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Modified</TableHead>
								<TableHead>Size</TableHead>
								<TableHead>Shared</TableHead>
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
											{file.starred && (
												<Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
											)}
										</div>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<Calendar className="h-3 w-3 text-muted-foreground" />
											{file.modified}
										</div>
									</TableCell>
									<TableCell>{file.size || "—"}</TableCell>
									<TableCell>
										{file.shared ? (
											<Badge variant="secondary">
												Shared
											</Badge>
										) : (
											"—"
										)}
									</TableCell>
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
													Delete
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Card>
			)}

			{/* Empty State */}
			{filteredFiles.length === 0 && (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<Folder className="h-12 w-12 text-muted-foreground mb-4" />
						<CardTitle className="mb-2">No files found</CardTitle>
						<CardDescription className="text-center mb-4">
							{searchQuery
								? "Try adjusting your search terms"
								: "Start by uploading your first file"}
						</CardDescription>
						{!searchQuery && (
							<Button>
								<Upload className="mr-2 h-4 w-4" />
								Upload Files
							</Button>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default DashboardHomePage;
