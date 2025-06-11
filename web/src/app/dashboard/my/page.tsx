"use client";

import { ActionButton } from "@/components/ui/action-button";
import { FileItem, FileItemProps } from "@/components/file/file-item";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { PageLayout } from "@/components/layouts/page-layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Filter,
  FolderPlus,
  Grid3X3,
  HardDrive,
  List,
  Search,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const DashboardHomePage = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data
  const files: FileItemProps[] = [
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
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageLayout>
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
              <ActionButton icon={Upload}>Upload</ActionButton>
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
                <p className="text-sm text-gray-600">Choose files to upload</p>
              </div>
            </DialogContent>
          </Dialog>

          <ActionButton icon={FolderPlus} variant="outline">
            New Folder
          </ActionButton>
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
            <ActionButton variant="outline" size="sm">
              Upgrade
            </ActionButton>
          </div>
          <Progress value={15} className="h-2" />
        </CardContent>
      </Card>

      {/* Quick Access */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Access</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {recentFiles.map((file) => (
            <FileItem key={file.id} {...file} />
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
          <ActionButton variant="outline" size="icon" icon={Filter} />
        </div>

        <div className="flex items-center gap-2">
          <ActionButton
            variant={viewMode === "grid" ? "default" : "outline"}
            size="icon"
            icon={Grid3X3}
            onClick={() => setViewMode("grid")}
          />
          <ActionButton
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            icon={List}
            onClick={() => setViewMode("list")}
          />
        </div>
      </div>

      {/* Files Display */}
      <div
        className={cn(
          "grid gap-4",
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
            : "grid-cols-1"
        )}
      >
        {filteredFiles.map((file) => (
          <FileItem key={file.id} {...file} />
        ))}
      </div>
    </PageLayout>
  );
};

export default DashboardHomePage;
