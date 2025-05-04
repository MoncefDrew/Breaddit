"use client";

import EditorJS from "@editorjs/editorjs";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { usePathname, useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import { Button } from "./ui/Button";
import { Image, Code, Link2, Type, ListOrdered, Table, FilePlus2 } from "lucide-react";

interface EditorProps {
  subredditId: string;
}
type FormData = z.infer<typeof PostValidator>;


export const Editor: FC<EditorProps> = ({ subredditId }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: "",
      content: null,
    },
  });

  const ref = useRef<EditorJS>();
  const [isMounted, SetIsMounted] = useState<boolean>(false);
  const [titleLength, setTitleLength] = useState<number>(0);
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const { mutate: createPost, isLoading: isPosting } = useMutation({
    mutationFn: async ({
      title,
      content,
      subredditId,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = { title, content, subredditId };
      const { data } = await axios.post("/api/subreddit/post/create", payload);
      return data;
    },
    onError: (err) => {
      return toast({
        title: "Something went wrong.",
        description: "Your post was not published. Please try again.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      const newPathname = pathname.split("/").slice(0, -1).join("/");
      router.push(newPathname);
      router.refresh();
      return toast({
        description: "Your post has been published.",
      });
    },
  });

  // --- Light Mode CSS Injection for EditorJS internals ---
  useEffect(() => {
    const style = document.createElement("style");
    // Add styles targeting EditorJS classes for light mode
    style.innerHTML = `
    /* General Editor text color */
    .codex-editor__redactor {
      padding-bottom: 100px !important; /* Ensure space below content */
    }
    .ce-paragraph[data-placeholder]:empty::before {
       color: #9CA3AF; /* Placeholder text color */
       opacity: 1;
    }
     .codex-editor {
       color: #374151 !important; /* Default text - darker for better contrast */
       background-color: #F9FAFB !important; /* Editor background - very light gray */
       border: 1px solid #E5E7EB !important; /* Editor border */
       border-radius: 0.375rem;
       padding: 1rem; /* Padding inside editor */
     }

     /* Selected block background */
     .ce-block--selected > .ce-block__content {
       background: #F3F4F6 !important; /* Slightly darker than background for selection */
     }

     /* Toolbar buttons (+, settings) */
     .ce-toolbar__plus, .ce-toolbar__settings-btn {
       background-color: white !important;
       color: #6B7280 !important; /* Default icon color */
       border: 1px solid #E5E7EB !important;
       box-shadow: 0 1px 2px rgba(0,0,0,0.05) !important;
     }
     .ce-toolbar__plus svg, .ce-toolbar__settings-btn svg {
        /* Ensure SVG inherits the color */
        fill: currentColor !important;
     }
     .ce-toolbar__plus:hover, .ce-toolbar__settings-btn:hover {
       background-color: #F9FAFB !important;
       color: #111827 !important; /* Icon color darkens on hover */
     }

     /* Popovers (tool options), Conversion Toolbar, Inline Toolbar */
     .ce-popover, .ce-conversion-toolbar, .ce-inline-toolbar {
       background-color: white !important;
       border: 1px solid #E5E7EB !important;
       color: #374151 !important; /* Default text inside */
       box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
     }
     /* --- Inline Toolbar Specifics --- */
      .ce-inline-toolbar {
         padding: 4px 6px !important; /* Adjust padding if needed */
      }
      .ce-inline-tool {
         color: #6B7280 !important; /* Default icon color for inline tools */
         margin: 0 2px !important; /* Spacing between inline tools */
         padding: 5px !important; /* Padding inside tool button */
         width: 28px !important; /* Fixed width */
         height: 28px !important; /* Fixed height */
         border-radius: 4px !important;
      }
      .ce-inline-tool svg {
         fill: currentColor !important; /* Ensure SVG uses the set color */
         width: 18px !important; /* Adjust icon size */
         height: 18px !important; /* Adjust icon size */
      }
       /* Active/Hover inline tool */
      .ce-inline-tool:hover {
         background-color: #F3F4F6 !important;
         color: #111827 !important; /* Darken icon on hover */
      }
      .ce-inline-tool--active {
         background-color: #F3F4F6 !important; /* Keep background subtle */
         color: #2563EB !important; /* Blue for active icon */
      }

      /* --- Popover/Conversion Tool Specifics --- */
      .ce-popover-item, .ce-conversion-tool {
        color: #374151 !important; /* Tool text label */
        padding: 8px 12px !important; /* Adjust padding */
      }
      .ce-popover-item:hover, .ce-conversion-tool:hover {
        background-color: #F3F4F6 !important;
      }
      .ce-popover-item__icon, .ce-conversion-tool__icon {
        color: #6B7280 !important; /* Icon next to text label */
        background-color: transparent !important; /* Ensure no background */
        margin-right: 8px !important; /* Space between icon and text */
        border: none !important; /* Remove potential borders */
        box-shadow: none !important; /* Remove potential shadows */
        padding: 0 !important; /* Reset padding */
      }
      .ce-popover-item__title, .ce-conversion-tool__title {
          /* Ensure title text aligns correctly */
           vertical-align: middle;
      }


     /* Inputs within EditorJS (like link input) */
     .cdx-input {
       background-color: #F9FAFB !important;
       border: 1px solid #E5E7EB !important;
       color: #374151 !important;
       padding: 8px 10px !important; /* Adjust padding */
       border-radius: 0.375rem !important;
     }

     /* Code block styling */
    .ce-code__textarea {
       background-color: #F3F4F6 !important; /* Light gray for code background */
       color: #374151 !important;
       border: 1px solid #E5E7EB !important;
       font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
       font-size: 0.9em;
       line-height: 1.5;
       border-radius: 0.375rem;
       padding: 10px !important;
     }

     /* List item styling */
     .cdx-list__item {
       color: #374151 !important; /* Use primary text color */
       padding: 2px 0 !important; /* Adjust vertical spacing */
     }

      /* Adjust Header block margins and style */
      .ce-block:has(> .ce-block__content > .ce-header) {
          margin-bottom: 0.5em !important;
          margin-top: 1em !important;
      }
      .ce-header {
          line-height: 1.2 !important;
          padding: 0 !important; /* Reset padding if needed */
          font-weight: 600 !important; /* Make headers bolder */
          color: #111827 !important; /* Ensure header text color */
      }
  `;
    document.head.appendChild(style);

    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []); // Run only once on mount

  const initializeEditor = useCallback(async () => {
    // Dynamically import EditorJS and tools
    const EditorJS = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current && isMounted) {
      // Check isMounted here
      const editor = new EditorJS({
        holder: "editor", // Target div ID
        onReady() {
          ref.current = editor;
        },
        placeholder: "Share your thoughts...", 
        inlineToolbar: true, 
        data: { blocks: [] },
        tools: {
          header: {
            //@ts-ignore
            class: Header,
            inlineToolbar: true, 
            config: {
              placeholder: "Heading",
              levels: [2, 3, 4],
              defaultLevel: 2,
            },
          },
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  // Use your upload function
                  const [res] = await uploadFiles("imageUploader", {
                    files: [file],
                  });
                  return {
                    success: 1,
                    file: {
                      url: res.url,
                    },
                  };
                },
              },
            },
          },
          list: {
            class: List,
            inlineToolbar: true, 
          },
          code: Code,
          inlineCode: InlineCode,
          table: {
            class: Table,
            inlineToolbar: true, 
          },
          embed: Embed,
        },
      });
    }
  }, [isMounted]); 


  useEffect(() => {
    if (typeof window !== "undefined") {
      SetIsMounted(true);
    }
  }, []);


  useEffect(() => {
    if (isMounted) {
      initializeEditor();
      setTimeout(() => _titleRef.current?.focus(), 0);
      return () => {
        ref.current?.destroy();
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  useEffect(() => {
    // Handle form errors
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Validation Error",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);


  async function onSubmit(data: FormData) {
    // Get content from EditorJS
    const blocks = await ref.current?.save();
    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks, // EditorJS content
      subredditId,
    };

    createPost(payload);
  }

  // Register title input with react-hook-form
  const { ref: titleRef, ...rest } = register("title");

  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    // Main container with updated light background and padding
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6">
        <h1 className="text-xl font-semibold text-gray-900 mb-6">Create post</h1>{" "}

        {/* Form wrapping the editor elements */}
        <form id="subreddit-post-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Community Selector */}
          <div className="mb-4">
            <button
              type="button"
              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              <span className="text-gray-500">r/</span>
              Select a community{" "}
            </button>
          </div>

          {/* Formatting tools */}
          <div className="flex gap-1 border-b border-gray-200 pb-2">
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <Type className="h-4 w-4 mr-1.5" />
              Text
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <Image className="h-4 w-4 mr-1.5" />
              Image
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <Link2 className="h-4 w-4 mr-1.5" />
              Link
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <ListOrdered className="h-4 w-4 mr-1.5" />
              List
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <Code className="h-4 w-4 mr-1.5" />
              Code
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <Table className="h-4 w-4 mr-1.5" />
              Table
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md"
            >
              <FilePlus2 className="h-4 w-4 mr-1.5" />
              More
            </Button>
          </div>

          {/* Title Input */}
          <div className="relative">
            <TextareaAutosize
              ref={(e) => {
                titleRef(e); 
                // @ts-ignore Assign to local ref
                _titleRef.current = e;
              }}
              {...rest} 
              placeholder="Title"
              onChange={(e) => setTitleLength(e.target.value.length)}
              className="w-full resize-none appearance-none overflow-hidden bg-gray-50 border border-gray-200 rounded-md px-3 py-3 text-base font-medium focus:outline-none focus:border-blue-300 focus:ring focus:ring-blue-100 focus:ring-opacity-50 text-gray-900 placeholder-gray-400" 
              maxLength={300} 
            />

            {/* Character counter */}
            <span className="absolute bottom-2 right-2 text-xs text-gray-400">
              {titleLength}/300
            </span>
          </div>

          {/* Tags button */}
          <div>
            <button
              type="button"
              className="text-xs font-medium text-gray-600 border border-gray-300 rounded-full px-3 py-1 hover:bg-gray-50"
            >
              Add tags
            </button>
          </div>

          {/* EditorJS Container */}
          <div
            id="editor"
            className="min-h-[200px] rounded-md"
          />

          {/* Action Buttons Container */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              disabled={isPosting}
              variant="outline"
              className="text-gray-700"
            >
              Save Draft
            </Button>
            <Button
              type="submit"
              disabled={isPosting}
              variant="primary"
              isLoading={isPosting}
            >
              {isPosting ? "Posting..." : "Publish Post"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Editor;