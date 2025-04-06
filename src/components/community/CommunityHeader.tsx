"use client";

import { FC, useState } from "react";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Image from "next/image";
import { Camera, ChevronLeft, Plus } from "lucide-react";
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
    router.back();
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-5xl mb-6">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="absolute top-4 left-4 z-10 bg-[#] bg--2 rounded-full text-white hover:bg-opacity-90 transition-all"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Cover Image Container */}
        <div className="w-full relative">
          <div className="w-full h-32 md:h-48 overflow-hidden relative mt-4 rounded-xl">
            {localCoverImage ? (
              <Image
                src={localCoverImage}
                alt={`r/${name} banner`}
                fill
                style={{ objectFit: "cover" }}
                priority
                className="rounded-xl"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-reddit via-reddit to-reddit opacity-80 rounded-t-lg"></div>
            )}

            {isModerator && (
              <Dialog
                open={isUploadDialogOpen}
                onOpenChange={setIsUploadDialogOpen}
              >
                <DialogTrigger asChild>
                  <button
                    className="absolute right-4 bottom-4 -2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70 transition-all"
                    aria-label="Upload cover image"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-[#] border-custom text-primary">
                  <DialogHeader>
                    <DialogTitle>Upload Cover Image</DialogTitle>
                    <DialogDescription className="text-muted">
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

          {/* Community Info Section - positioned below cover image */}
          <div className=" w-full rounded-b-lg pt-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Left side with profile and name */}
              <div className="flex items-center ml-4 gap-3">
                {/* Profile image - positioned to overlap cover image */}
                <div className="relative -mt-16">
                  <Dialog
                    open={isProfileUploadDialogOpen}
                    onOpenChange={setIsProfileUploadDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <div className="relative cursor-pointer group">
                        <div className="size-24 rounded-full overflow-hidden  shadow-lg">
                          {localProfileImage ? (
                            <Image
                              src={localProfileImage}
                              alt={`r/${name} profile`}
                              fill
                              style={{ objectFit: "cover" }}
                              priority
                              className="rounded-full border-4 border-[#0E1113] "
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-reddit to-reddit rounded-full border-2 border-reddit">
                              <span className="text-xl font-bold text-white">
                                r/
                              </span>
                            </div>
                          )}
                        </div>
                        {isModerator && (
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center rounded-full">
                            <Camera className="h-6 w-6 text-transparent group-hover:text-white" />
                          </div>
                        )}
                      </div>
                    </DialogTrigger>

                    {isModerator && (
                      <DialogContent className="bg-[#0E1113] border-custom text-primary">
                        <DialogHeader>
                          <DialogTitle>Upload Community Icon</DialogTitle>
                          <DialogDescription className="text-muted">
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

                {/* Community name */}
                <h1 className="text-2xl md:text-3xl font-bold text-primary">r/{name}</h1>
              </div>

              {/* Right side with action buttons */}
              <div className="flex flex-row gap-2  items-center ml-auto sm:ml-0">
                <Button
                  size="sm"
                  className="bg-transparent gap-1 px-3 py-0.5 text-zinc-400 rounded-full border border-zinc-custom hover:border-zinc-300 hover:text-zinc-300 transition-colors duration-200"
                  onClick={() => {
                    window.location.href = `/r/${name}/submit`;
                  }}
                >
                  <span ><Plus/></span>
                  Create Post
                </Button>
                <JoinButton subredditId={id} size="default" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHeader;