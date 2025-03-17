import { generateReactHelpers } from '@uploadthing/react'
import { genUploader } from "uploadthing/client";

import type { OurFileRouter } from '@/app/api/uploadthing/core'

export const { uploadFiles } = genUploader<OurFileRouter>();

export const { useUploadThing } = generateReactHelpers<OurFileRouter>();
