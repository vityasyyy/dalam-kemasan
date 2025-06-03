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
	Star,
	Filter,
	MoreHorizontal,
	File,
	Folder,
	Image,
	FileText,
	Video,
	Music,
	Archive,
	Share2,
	Trash2,
	Download,
	Eye,
	Calendar,
	Grid3X3,
	List,
} from "lucide-react";

interface StarredFile {
	id: string;
	name: string;
	type: "file" | "folder";
	fileType?: "image" | "document" | "video" | "audio" | "archive" | "other";
	size?: string;
	modified: string;
	location: string;
	shared?: boolean;
	starredDate: string;
}

const StarredPage = () => {
	const [searchQuery, setSearchQuery] = useState("");
	const [viewMode, setViewMode] = useState<"grid" | "list">("list");

	// Mock data for starred files
	const starredFiles: StarredFile[] = [
		{
			id: "1",
			name: "Important Contract.pdf",
			type: "file",
			fileType: "document",
			size: "2.1 MB",
			modified: "2 days ago",
			location: "Documents/Legal",
			starredDate: "Last week",
		},
		{
			id: "2",
			name: "Project Alpha",
			type: "folder",
			modified: "1 hour ago",
			location: "Work/Projects",
			starredDate: "2 weeks ago",
			shared: true,
		},
		{
			id: "3",
			name: "family-vacation.jpg",
			type: "file",
			fileType: "image",
			size: "5.2 MB",
			modified: "3 days ago",
			location: "Photos/2024",
			starredDate: "1 month ago",
		},
		{
			id: "4",
			name: "presentation-template.pptx",
			type: "file",
			fileType: "document",
			size: "15.8 MB",
			modified: "1 week ago",
			location: "Templates",
			starredDate: "3 weeks ago",
			shared: true,
		},
		{
			id: "5",
			name: "Client Meeting Recording",
			type: "file",
			fileType: "video",
			size: "180 MB",
			modified: "5 days ago",
			location: "Meetings/Recordings",
			starredDate: "2 days ago",
		},
		{
			id: "6",
			name: "Reference Materials",
			type: "folder",
			modified: "2 weeks ago",
			location: "Research",
			starredDate: "1 week ago",
		},
	];

	const getFileIcon = (item: StarredFile) => {
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

	const filteredFiles = starredFiles.filter(
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
						<Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
						Starred
					</h1>
					<p className="text-muted-foreground">
						Files and folders you've marked as important
					</p>
				</div>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
							<div>
								<p className="text-2xl font-bold">
									{starredFiles.length}
								</p>
								<p className="text-sm text-muted-foreground">
									Starred items
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<FileText className="h-5 w-5 text-blue-500" />
							<div>
								<p className="text-2xl font-bold">
									{
										starredFiles.filter(
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
							<Folder className="h-5 w-5 text-orange-500" />
							<div>
								<p className="text-2xl font-bold">
									{
										starredFiles.filter(
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
							<Share2 className="h-5 w-5 text-green-500" />
							<div>
								<p className="text-2xl font-bold">
									{
										starredFiles.filter((f) => f.shared)
											.length
									}
								</p>
								<p className="text-sm text-muted-foreground">
									Shared
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Search and Controls */}
			<div className="flex items-center justify-between gap-4">
				<div className="flex items-center gap-2 flex-1">
					<div className="relative flex-1 max-w-md">
						<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							placeholder="Search starred files..."
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
										<Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
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
												Unstar
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
								<TableHead>Starred</TableHead>
								<TableHead>Location</TableHead>
								<TableHead>Modified</TableHead>
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
												<Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
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
										<span className="text-sm text-muted-foreground">
											{file.starredDate}
										</span>
									</TableCell>
									<TableCell>
										<span className="text-sm text-muted-foreground">
											{file.location}
										</span>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<Calendar className="h-3 w-3 text-muted-foreground" />
											{file.modified}
										</div>
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
													Unstar
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
						<Star className="h-12 w-12 text-muted-foreground mb-4" />
						<CardTitle className="mb-2">
							No starred files found
						</CardTitle>
						<CardDescription className="text-center">
							{searchQuery
								? "Try adjusting your search terms"
								: "Star files to keep them organized and easily accessible"}
						</CardDescription>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default StarredPage;
