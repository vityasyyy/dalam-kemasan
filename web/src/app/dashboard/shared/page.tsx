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
	Search,
	Users,
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
	UserCheck,
} from "lucide-react";

interface SharedFile {
	id: string;
	name: string;
	type: "file" | "folder";
	fileType?: "image" | "document" | "video" | "audio" | "archive" | "other";
	size?: string;
	modified: string;
	owner: string;
	ownerAvatar?: string;
	starred?: boolean;
}

const SharedWithMePage = () => {
	const [searchQuery, setSearchQuery] = useState("");

	// Mock data for shared files
	const sharedFiles: SharedFile[] = [
		{
			id: "1",
			name: "Q4 Financial Report.xlsx",
			type: "file",
			fileType: "document",
			size: "2.5 MB",
			modified: "2 hours ago",
			owner: "Sarah Johnson",
			ownerAvatar: "/avatars/sarah.jpg",
		},
		{
			id: "2",
			name: "Marketing Campaign Assets",
			type: "folder",
			modified: "1 day ago",
			owner: "Mike Chen",
			ownerAvatar: "/avatars/mike.jpg",
			starred: true,
		},
		{
			id: "3",
			name: "team-photo.jpg",
			type: "file",
			fileType: "image",
			size: "4.2 MB",
			modified: "3 days ago",
			owner: "Emily Davis",
		},
		{
			id: "4",
			name: "Project Presentation.pptx",
			type: "file",
			fileType: "document",
			size: "15.8 MB",
			modified: "1 week ago",
			owner: "Alex Rodriguez",
			starred: true,
		},
		{
			id: "5",
			name: "Design Resources",
			type: "folder",
			modified: "2 weeks ago",
			owner: "Lisa Wang",
		},
	];

	const getFileIcon = (item: SharedFile) => {
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

	const filteredFiles = sharedFiles.filter(
		(file) =>
			file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			file.owner.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="flex-1 space-y-6 p-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold flex items-center gap-3">
						<Users className="h-8 w-8 text-blue-600" />
						Shared with me
					</h1>
					<p className="text-muted-foreground">
						Files and folders shared by others
					</p>
				</div>
			</div>

			{/* Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<Share2 className="h-5 w-5 text-blue-500" />
							<div>
								<p className="text-2xl font-bold">
									{sharedFiles.length}
								</p>
								<p className="text-sm text-muted-foreground">
									Shared items
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<UserCheck className="h-5 w-5 text-green-500" />
							<div>
								<p className="text-2xl font-bold">5</p>
								<p className="text-sm text-muted-foreground">
									People sharing
								</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center gap-3">
							<Star className="h-5 w-5 text-yellow-500" />
							<div>
								<p className="text-2xl font-bold">
									{
										sharedFiles.filter((f) => f.starred)
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
						placeholder="Search shared files and owners..."
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
							<TableHead>Owner</TableHead>
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
										{file.starred && (
											<Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
										)}
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<Avatar className="h-6 w-6">
											<AvatarImage
												src={file.ownerAvatar}
											/>
											<AvatarFallback className="text-xs">
												{file.owner
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</AvatarFallback>
										</Avatar>
										<span className="text-sm">
											{file.owner}
										</span>
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
												<Star className="mr-2 h-4 w-4" />
												{file.starred
													? "Unstar"
													: "Star"}
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
						<Users className="h-12 w-12 text-muted-foreground mb-4" />
						<CardTitle className="mb-2">
							No shared files found
						</CardTitle>
						<CardDescription className="text-center">
							{searchQuery
								? "Try adjusting your search terms"
								: "No files have been shared with you yet"}
						</CardDescription>
					</CardContent>
				</Card>
			)}
		</div>
	);
};

export default SharedWithMePage;
