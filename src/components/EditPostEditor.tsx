"use client";

import EditorJS from "@editorjs/editorjs";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { EditPostValidator } from "@/lib/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import { uploadFiles } from "@/lib/uploadthing";
import { Button } from "./ui/Button";
import { Loader2 } from "lucide-react";

interface EditPostEditorProps {
  postId: string | undefined;
  initialTitle: string | undefined;
  initialContent: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

type FormData = z.infer<typeof EditPostValidator>;

export const EditPostEditor: FC<EditPostEditorProps> = ({
  postId,
  initialTitle,
  initialContent,
  onSuccess,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(EditPostValidator),
    defaultValues: {
      title: initialTitle,
      content: initialContent,
    },
  });

  const ref = useRef<EditorJS>();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const _titleRef = useRef<HTMLTextAreaElement | null>(null);
  const router = useRouter();

  const { mutate: updatePost } = useMutation({
    mutationFn: async ({ title, content }: FormData) => {
      setIsSubmitting(true);
      return axios.patch(`/api/subreddit/post/edit`, {
        postId,
        title,
        content,
      });
    },
    onError: () => {
      setIsSubmitting(false);
      toast({
        title: "Something went wrong.",
        description: "Your post was not updated. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      setIsSubmitting(false);
      router.refresh();

      toast({
        description: "Your post has been updated!",
      });

      if (onSuccess) onSuccess();
    },
  });

  const initializeEditor = useCallback(async () => {
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      const editor = new EditorJS({
        holder: "editor",
        onReady: () => {
          ref.current = editor;
        },
        placeholder: "Edit your post...",
        inlineToolbar: true,
        data: initialContent || { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: { endpoint: "/api/link" },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles("imageUploader", {
                    files: [file],
                  });
                  return {
                    success: 1,
                    file: { url: res.ufsUrl },
                  };
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, [initialContent]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const value of Object.values(errors)) {
        toast({
          title: "Something went wrong.",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();

      setTimeout(() => {
        _titleRef.current?.focus();
      }, 0);
    };

    if (isMounted) {
      init();
      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  async function onSubmit(data: FormData) {
    const blocks = await ref.current?.save();
    updatePost({
      title: data.title,
      content: blocks,
    });
  }

  const { ref: titleRef, ...rest } = register("title");

  return (
    <div className="w-full md:max-w-4xl mx-auto md:h-auto p-6 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col transition-all">
      <form
        id="edit-post-form"
        className="flex-grow flex flex-col"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone flex-grow max-w-none">
          <TextareaAutosize
            ref={(e) => {
              titleRef(e);
              if (e) _titleRef.current = e;
            }}
            {...rest}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-4xl md:text-5xl font-bold focus:outline-none text-gray-900 placeholder:text-gray-400 mb-4 transition-colors focus:border-b focus:border-gray-200 pb-2"
          />
          
          <div className="h-px w-full bg-gray-100 mb-6" />
          
          <div 
            id="editor" 
            className="min-h-[300px] md:min-h-[500px] flex-grow text-gray-800 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-200 rounded-md transition-all" 
          />
          
          <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-md border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lightbulb">
              <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/>
              <path d="M9 18h6"/>
              <path d="M10 22h4"/>
            </svg>
            Press{" "}
            <kbd className="rounded-md border border-gray-300 bg-white px-2 py-0.5 text-xs font-semibold text-gray-800 shadow-sm">
              Tab
            </kbd>{" "}
            to open the command menu
          </div>
        </div>

        <div className="w-full flex justify-end mt-6 space-x-3">
          <Button 
            type="button"
            variant="outline" 
            onClick={onCancel} 
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Post"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPostEditor;