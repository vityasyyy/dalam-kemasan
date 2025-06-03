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
	Trash2,
	Filter,
	MoreHorizontal,
	File,
	Folder,
	Image,
	FileText,
	Video,
	Music,
	Archive,
	RotateCcw,
	Calendar,
	AlertTriangle,
	RefreshCw,
} from "lucide-react";

interface TrashedFile {
	id: string;
	name: string;
	type: "file" | "folder";
	fileType?: "image" | "document" | "video" | "audio" | "archive" | "other";
	size?: string;
	deletedDate: string;
	originalLocation: string;
	daysUntilPermanentDeletion: number;
}

const TrashPage = () => {
	const [searchQuery, setSearchQuery] = useState("");

	// Mock data for trashed files
	const trashedFiles: TrashedFile[] = [
		{
			id: "1",
			name: "old-presentation.pptx",
			type: "file",
			fileType: "document",
			size: "12.1 MB",
			deletedDate: "2 days ago",
			originalLocation: "Documents/Old Files",
			daysUntilPermanentDeletion: 28,
		},
		{
			id: "2",
			name: "Temporary Folder",
			type: "folder",
			deletedDate: "1 week ago",
			originalLocation: "Desktop",
			daysUntilPermanentDeletion: 23,
		},
		{
			id: "3",
			name: "screenshot-draft.png",
			type: "file",
			fileType: "image",
			size: "3.2 MB",
			deletedDate: "3 days ago",
			originalLocation: "Screenshots",
			daysUntilPermanentDeletion: 27,
		},
		{
			id: "4",
			name: "backup-old.zip",
			type: "file",
			fileType: "archive",
			size: "45.8 MB",
			deletedDate: "1 day ago",
			originalLocation: "Backups",
			daysUntilPermanentDeletion: 29,
		},
		{
			id: "5",
			name: "test-video.mp4",
			type: "file",
			fileType: "video",
			size: "180 MB",
			deletedDate: "5 days ago",
			originalLocation: "Videos/Tests",
			daysUntilPermanentDeletion: 25,
		},
		{
			id: "6",
			name: "notes-draft.txt",
			type: "file",
			fileType: "document",
			size: "2 KB",
			deletedDate: "2 weeks ago",
			originalLocation: "Documents/Notes",
			daysUntilPermanentDeletion: 16,
		},
	];

	const getFileIcon = (item: TrashedFile) => {
		if (item.type === "folder")
			return <Folder className="h-5 w-5 text-gray-400" />;

		switch (item.fileType) {
			case "image":
				return <Image className="h-5 w-5 text-gray-400" />;
			case "document":
				return <FileText className="h-5 w-5 text-gray-400" />;
			case "video":
				return <Video className="h-5 w-5 text-gray-400" />;
			case "audio":
				return <Music className="h-5 w-5 text-gray-400" />;
			case "archive":
				return <Archive className="h-5 w-5 text-gray-400" />;
			default:
				return <File className="h-5 w-5 text-gray-400" />;
		}
	};

	const filteredFiles = trashedFiles.filter(
		(file) =>
			file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			file.originalLocation
				.toLowerCase()
				.includes(searchQuery.toLowerCase())
	);

	const handleEmptyTrash = () => {
		// Handle empty trash action
		console.log("Empty trash");
	};

	const handleRestoreAll = () => {
		// Handle restore all action
		console.log("Restore all");
	};

	return (
		<div className="flex-1 space-y-6 p-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<Trash2 className="h-8 w-8 text-red-600" />
						Trash
					</h1>
					<p className="text-muted-foreground">
						Items in trash are deleted forever after 30 days
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						onClick={handleRestoreAll}
						disabled={trashedFiles.length === 0}>
						<RotateCcw className="mr-2 h-4 w-4" />
						Restore All
					</Button>
					<Button
						variant="destructive"
						onClick={handleEmptyTrash}
						disabled={trashedFiles.length === 0}>
						<Trash2 className="mr-2 h-4 w-4" />
						Empty Trash
					</Button>
				</div>
			</div>

			{/* Warning Notice */}
			<Card className="border-yellow-200 bg-yellow-50">
				<CardContent className="pt-6">
					<div className="flex items-center gap-3">
						<AlertTriangle className="h-5 w-5 text-yellow-600" />
						<div>
							<p className="font-medium text-yellow-800">
								Items in trash will be permanently deleted after
								30 days
							</p>
							<p className="text-sm text-yellow-700">
								You can restore them before then or delete them
								permanently
							</p>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<Trash2 className="h-5 w-5 text-red-500" />
							<div>
								<p className="text-2xl font-bold">
									{trashedFiles.length}
								</p>
								<p className="text-sm text-muted-foreground">
									Items in trash
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<FileText className="h-5 w-5 text-gray-500" />
							<div>
								<p className="text-2xl font-bold">
									{
										trashedFiles.filter(
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
							<Folder className="h-5 w-5 text-gray-500" />
							<div>
								<p className="text-2xl font-bold">
									{
										trashedFiles.filter(
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
							<Calendar className="h-5 w-5 text-orange-500" />
							<div>
								<p className="text-2xl font-bold">
									{Math.min(
										...trashedFiles.map(
											(f) => f.daysUntilPermanentDeletion
										)
									)}
								</p>
								<p className="text-sm text-muted-foreground">
									Days until deletion
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
						placeholder="Search trash..."
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
			{trashedFiles.length > 0 ? (
				<Card>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>Original location</TableHead>
								<TableHead>Deleted</TableHead>
								<TableHead>Size</TableHead>
								<TableHead>Days left</TableHead>
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
											<span className="font-medium text-muted-foreground">
												{file.name}
											</span>
										</div>
									</TableCell>
									<TableCell>
										<span className="text-sm text-muted-foreground">
											{file.originalLocation}
										</span>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-2">
											<Calendar className="h-3 w-3 text-muted-foreground" />
											{file.deletedDate}
										</div>
									</TableCell>
									<TableCell>{file.size || "—"}</TableCell>
									<TableCell>
										<Badge
											variant={
												file.daysUntilPermanentDeletion <=
												7
													? "destructive"
													: "secondary"
											}>
											{file.daysUntilPermanentDeletion}{" "}
											days
										</Badge>
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
													<RotateCcw className="mr-2 h-4 w-4" />
													Restore
												</DropdownMenuItem>
												<DropdownMenuItem className="text-red-600">
													<Trash2 className="mr-2 h-4 w-4" />
													Delete Forever
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Card>
			) : (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<Trash2 className="h-12 w-12 text-muted-foreground mb-4" />
						<CardTitle className="mb-2">Trash is empty</CardTitle>
						<CardDescription className="text-center">
							{searchQuery
								? "No items match your search"
								: "Items you delete will appear here"}
						</CardDescription>
					</CardContent>
				</Card>
			)}

			{/* Empty State for Search */}
			{filteredFiles.length === 0 && trashedFiles.length > 0 && (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<Search className="h-12 w-12 text-muted-foreground mb-4" />
						<CardTitle className="mb-2">No results found</CardTitle>
						<CardDescription className="text-center">
							Try adjusting your search terms
						</CardDescription>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default TrashPage;
