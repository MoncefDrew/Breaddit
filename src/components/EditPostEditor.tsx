"use client";

import EditorJS from "@editorjs/editorjs";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { EditPostValidator } from "@/lib/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import {  useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import { uploadFiles } from "@/lib/uploadthing";
import { Button } from "./ui/Button";

interface EditPostEditorProps {
  postId: string | undefined;
  initialTitle: string | undefined;
  initialContent: any;
  onSuccess?: () => void;
  onCancel?: () => void; // New Cancel function
}

type FormData = z.infer<typeof EditPostValidator>;

export const EditPostEditor: FC<EditPostEditorProps> = ({
  postId,
  initialTitle,
  initialContent,
  onSuccess,
  onCancel, // Accept cancel function as prop
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
  const _titleRef = useRef<HTMLTextAreaElement | null>(null);
  const router = useRouter();

  const { mutate: updatePost } = useMutation({
    mutationFn: async ({ title, content }: FormData) => {
      return axios.patch(`/api/subreddit/post/edit`, {
        postId,
        title,
        content,
      });
    },
    onError: () => {
      toast({
        title: "Something went wrong.",
        description: "Your post was not updated. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
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
    <div className="w-full h-screen md:h-auto p-4 bg-surface rounded-lg border border-custom flex flex-col">
      <form
        id="edit-post-form"
        className="flex-grow flex flex-col"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="prose prose-stone dark:prose-invert flex-grow">
          <TextareaAutosize
            ref={(e) => {
              titleRef(e);
              if (e) _titleRef.current = e;
            }}
            {...rest}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none text-primary placeholder:text-muted"
          />
          <div id="editor" className="min-h-[500px] flex-grow text-primary" />
          <p className="text-sm text-muted">
            Use{" "}
            <kbd className="rounded-md border border-custom bg-surface-dark-hover px-1 text-xs uppercase text-primary">
              Tab
            </kbd>{" "}
            to open the command menu.
          </p>
        </div>

        <div className="w-full flex justify-end mt-4 space-x-2">
          <Button variant="outline" onClick={onCancel} className="bg-surface border-custom text-primary hover:bg-surface-dark-hover">
            Cancel
          </Button>

          <Button
            type="submit"
            className="bg-reddit text-white hover:bg-reddit"
          >
            Update Post
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPostEditor;
