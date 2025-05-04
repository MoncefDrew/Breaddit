"use client";

import { FC, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Image from "next/image";
import { Camera, ChevronLeft, Plus, Shield } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageUploader from "../upload/ImageUploader";
import JoinButton from "../JoinButton";

interface CommunityHeaderProps {
  id: string;
  name: string;
  isSubscribed: boolean;
  isModerator?: boolean;
  coverImage?: string | null;
  profileImage?: string | null;
}

const CommunityHeader: FC<CommunityHeaderProps> = ({
  id,
  name,
  isSubscribed,
  isModerator = false,
  coverImage,
  profileImage,
}) => {
  const [localCoverImage, setLocalCoverImage] = useState(coverImage);
  const [localProfileImage, setLocalProfileImage] = useState(profileImage);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isProfileUploadDialogOpen, setIsProfileUploadDialogOpen] =
    useState(false);

  const router = useRouter();
  const { toast } = useToast();

  // Update the cover image in the database after upload
  const handleCoverImageUpload = async (url: string) => {
    try {
      // Update the image in the database
      const response = await axios.post("/api/subreddit/images", {
        subredditName: name,
        imageType: "cover",
        imageUrl: url,
      });

      if (response.status === 200) {
        setLocalCoverImage(url);
        setIsUploadDialogOpen(false);

        toast({
          title: "Cover Image Updated",
          description: `Community banner has been updated.`,
          variant: "default",
        });

        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update cover image. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Update the profile image in the database after upload
  const handleProfileImageUpload = async (url: string) => {
    try {
      // Update the image in the database
      const response = await axios.post("/api/subreddit/images", {
        subredditName: name,
        imageType: "profile",
        imageUrl: url,
      });

      if (response.status === 200) {
        setLocalProfileImage(url);
        setIsProfileUploadDialogOpen(false);

        toast({
          title: "Profile Image Updated",
          description: `Community profile image has been updated.`,
          variant: "default",
        });

        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile image. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Go back to previous page
  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="w-full bg-white border-b border-gray-200">
      {/* Back button */}
      <div className="max-w-5xl mx-auto px-4 relative">
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 z-10 p-1 rounded-full text-gray-500 hover:bg-gray-100"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      {/* Cover image */}
      <div className="w-full overflow-hidden relative">
        <div className="w-full h-56 overflow-hidden relative">
          {localCoverImage ? (
            <Image
              src={localCoverImage}
              alt={`r/${name} banner`}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-100 to-blue-200"></div>
          )}

          {/* Cover image edit button */}
          {isModerator && (
            <Dialog
              open={isUploadDialogOpen}
              onOpenChange={setIsUploadDialogOpen}
            >
              <DialogTrigger asChild>
                <button
                  className="absolute right-4 bottom-4 p-1.5 rounded-full bg-white/80 text-gray-700 hover:bg-white"
                  aria-label="Upload cover image"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </DialogTrigger>
              <DialogContent className="bg-white border border-gray-200">
                <DialogHeader>
                  <DialogTitle className="text-gray-900">Upload Cover Image</DialogTitle>
                  <DialogDescription className="text-gray-500">
                    Upload a new banner image for r/{name}
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <ImageUploader
                    endpoint="coverImage"
                    onUploadComplete={handleCoverImageUpload}
                  />
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Profile and community info */}
        <div className="max-w-5xl mx-auto px-4 md:pl-10">
          <div className="flex items-start mt-2 mb-6">
            {/* Profile image */}
            <div className="relative -mt-10 mr-4">
              <Dialog
                open={isProfileUploadDialogOpen}
                onOpenChange={setIsProfileUploadDialogOpen}
              >
                <DialogTrigger asChild>
                  <div className="relative cursor-pointer group">
                    <div className="h-20 w-20 rounded-full overflow-hidden border-4 border-white">
                      {localProfileImage ? (
                        <Image
                          src={localProfileImage}
                          alt={`r/${name} profile`}
                          fill
                          style={{ objectFit: "cover" }}
                          priority
                          className="rounded-full"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-blue-100 rounded-full">
                          <span className="text-lg font-bold text-blue-600">
                            r/
                          </span>
                        </div>
                      )}
                    </div>
                    {isModerator && (
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center rounded-full">
                        <Camera className="h-5 w-5 text-transparent group-hover:text-white" />
                      </div>
                    )}
                  </div>
                </DialogTrigger>

                {isModerator && (
                  <DialogContent className="bg-white border border-gray-200">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900">Upload Community Icon</DialogTitle>
                      <DialogDescription className="text-gray-500">
                        Upload a new profile image for r/{name}
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <ImageUploader
                        endpoint="profileImage"
                        onUploadComplete={handleProfileImageUpload}
                      />
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            </div>

            {/* Community info and actions */}
            <div className="flex flex-col flex-grow">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">r/{name}</h1>
                  <p className="text-xs text-gray-500 mt-0.5">r/{name}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => router.push(`/r/${name}/submit`)}
                    size="sm"
                    variant="outline"
                    className="hidden md:flex text-xs px-3 py-1 h-8 bg-white border border-gray-200 text-gray-800"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" />
                    Create Post
                  </Button>
                  
                  {isModerator ? (
                    <Button
                      onClick={() => router.push(`/r/${name}/mod`)}
                      variant="ghost"
                      size="sm"
                      className="text-xs px-3 py-1 h-8 text-gray-700"
                    >
                      <Shield className="h-3.5 w-3.5 mr-1.5" />
                      Mod Tools
                    </Button>
                  ) : (
                    <JoinButton subredditId={id} size="sm" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHeader;