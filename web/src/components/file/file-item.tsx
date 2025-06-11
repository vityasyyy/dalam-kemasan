import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Archive,
  File,
  FileText,
  Folder,
  Image,
  Music,
  Star,
  Video,
} from "lucide-react";

export interface FileItemProps {
  id: string;
  name: string;
  type: "file" | "folder";
  fileType?: "image" | "document" | "video" | "audio" | "archive";
  size?: string;
  modified: string;
  starred?: boolean;
  shared?: boolean;
  onClick?: () => void;
  className?: string;
}

export function FileItem({
  name,
  type,
  fileType,
  modified,
  starred,
  onClick,
  className,
}: FileItemProps) {
  const getFileIcon = () => {
    if (type === "folder") return <Folder className="h-5 w-5 text-blue-500" />;

    switch (fileType) {
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

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-shadow cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {getFileIcon()}
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{name}</p>
            <p className="text-sm text-muted-foreground">{modified}</p>
          </div>
          {starred && (
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
