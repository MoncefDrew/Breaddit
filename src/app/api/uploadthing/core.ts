import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// Temporary auth function - replace with your actual auth implementation
const auth = (req: Request) => ({ id: "fakeId" });

// Types for our upload handlers
type UploadHandlerResponse = {
  uploadedBy: string;
  url?: string;
};

// Common middleware for all upload handlers
const authMiddleware = async ({ req }: { req: Request }) => {
  const user = await auth(req);
  if (!user) throw new UploadThingError("Unauthorized");
  return { userId: user.id };
};

// Common image configuration
const imageConfig = {
  maxFileSize: "4MB",
  maxFileCount: 1,
} as const;

// Common upload complete handler
const createUploadCompleteHandler = (type: string) => {
  return async ({ metadata, file }: { metadata: { userId: string }; file: { url: string } }) => {
    console.log(`${type} Uploaded:`, file.url);
    return { 
      uploadedBy: metadata.userId,
      url: file.url 
    } satisfies UploadHandlerResponse;
  };
};

export const ourFileRouter = {
  imageUploader: f({
    image: imageConfig,
  })
    .middleware(authMiddleware)
    .onUploadComplete(createUploadCompleteHandler("Image")),

  profileImage: f({
    image: imageConfig,
  })
    .middleware(authMiddleware)
    .onUploadComplete(createUploadCompleteHandler("Profile Image")),
  
  coverImage: f({
    image: {
      ...imageConfig,
      maxFileSize: "16MB", // Larger size for cover images
    },
  })
    .middleware(authMiddleware)
    .onUploadComplete(createUploadCompleteHandler("Cover Image")),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
