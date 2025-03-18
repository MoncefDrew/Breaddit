"use client";

import { FC, useState } from "react";
import { Button } from "../ui/Button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Image from "next/image";
import { Camera, ChevronLeft, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImageUploader from "../upload/ImageUploader";

interface CommunityHeaderProps {
  name: string;
  memberCount: number;
  isSubscribed: boolean;
  isModerator?: boolean;
  coverImage?: string | null;
  profileImage?: string | null;
}

const CommunityHeader: FC<CommunityHeaderProps> = ({
  name,
  memberCount,
  isSubscribed,
  isModerator = false,
  coverImage,
  profileImage,
}) => {
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(isSubscribed);
  const [localCoverImage, setLocalCoverImage] = useState(coverImage);
  const [localProfileImage, setLocalProfileImage] = useState(profileImage);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isProfileUploadDialogOpen, setIsProfileUploadDialogOpen] =
    useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const handleSubscribe = async () => {
    try {
      setIsSubscriptionLoading(true);
      const url = subscribed
        ? `/api/subreddit/unsubscribe`
        : `/api/subreddit/subscribe`;

      const response = await axios.post(url, { subredditName: name });

      if (response.status === 200) {
        setSubscribed(!subscribed);
        toast({
          title: subscribed ? "Unsubscribed" : "Subscribed",
          description: subscribed
            ? `You have unsubscribed from r/${name}`
            : `You have subscribed to r/${name}`,
          variant: "default",
        });
        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubscriptionLoading(false);
    }
  };

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
          className="absolute top-4 left-4 z-10 bg-surface bg-opacity-70 p-2 rounded-full text-white hover:bg-opacity-90 transition-all"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Cover Image - Full width with rounded corners */}
        <div 
          className="w-full bg-gradient-to-r from-surface to-surface-dark-hover overflow-hidden rounded-t-lg relative"
        >
          {/* Cover image container */}
          <div className="h-32 sm:h-40 md:h-56 w-full relative">
            {localCoverImage ? (
              <Image 
                src={localCoverImage}
                alt={`r/${name} banner`}
                fill
                style={{ objectFit: 'cover' }}
                priority
                className="rounded-t-lg"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-reddit via-reddit to-reddit opacity-80 rounded-t-lg"></div>
            )}
            
            {isModerator && (
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <button 
                    className="absolute right-4 bottom-4 p-2 rounded-full bg-surface-dark-hover text-primary hover:bg-surface-dark-hover disabled:opacity-50 shadow-md"
                    aria-label="Upload cover image"
                  >
                    <Camera className="h-5 w-5" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-surface border-custom text-primary">
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
          
          {/* Community Info Section with Profile Image */}
          <div className="w-full bg-surface border border-custom rounded-b-lg relative pb-3">
            {/* Profile image positioned to overlap the cover image */}
            <div className="absolute -top-12 left-8 sm:left-10">
              <Dialog open={isProfileUploadDialogOpen} onOpenChange={setIsProfileUploadDialogOpen}>
                <DialogTrigger asChild>
                  <div className="relative cursor-pointer group">
                    <div className="h-20 w-20 rounded-full overflow-hidden bg-surface border-4 border-surface shadow-lg">
                      {localProfileImage ? (
                        <Image 
                          src={localProfileImage}
                          alt={`r/${name} profile`}
                          fill
                          style={{ objectFit: 'cover' }}
                          priority
                          className="rounded-full border-2 bg-surface"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-reddit to-reddit rounded-full border-2 border-reddit">
                          <span className="text-xl font-bold text-white">r/</span>
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
                  <DialogContent className="bg-surface border-custom text-primary">
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
            
            {/* Info content positioned to account for profile image */}
            <div className="pl-32 sm:pl-36 pr-4 pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-primary">r/{name}</h1>
                <p className="text-sm text-muted mt-1">
                  {memberCount} {memberCount === 1 ? 'member' : 'members'}
                </p>
              </div>
              
              <div className="mt-3 sm:mt-0">
                <Button
                  onClick={handleSubscribe}
                  isLoading={isSubscriptionLoading}
                  className={
                    subscribed 
                      ? 'bg-surface-dark-hover text-primary hover:bg-surface-dark-hover border border-custom' 
                      : 'bg-reddit text-white hover:bg-reddit'
                  }
                >
                  {subscribed ? 'Joined' : 'Join'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CommunityHeader;
