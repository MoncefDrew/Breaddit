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
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  const { mutate: createPost, isLoading: isPosting } = useMutation({
    // Added isLoading
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
      // Added error logging
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

  // --- Dark Mode CSS Injection for EditorJS internals ---
  // Updated dark theme with #0b0d0f background and appropriate text colors
  useEffect(() => {
    const style = document.createElement("style");
    // Add styles targeting EditorJS classes for dark mode with new color scheme
    style.innerHTML = `
    /* General Editor text color */
    .codex-editor__redactor {
      padding-bottom: 100px !important; /* Ensure space below content */
    }
    .ce-paragraph[data-placeholder]:empty::before {
       color: #6B7280; /* Placeholder text color */
       opacity: 1;
    }
     .codex-editor {
       color: #E5E7EB !important; /* Default text - lighter for better contrast */
       background-color: #0b0d0f !important; /* Updated editor background */
       border: 1px solid #1F2937 !important; /* Editor border */
       border-radius: 4px;
       padding: 12px; /* Padding inside editor */
     }

     /* Selected block background */
     .ce-block--selected > .ce-block__content {
       background: #111827 !important; /* Slightly lighter than background for selection */
     }

     /* Toolbar buttons (+, settings) */
     .ce-toolbar__plus, .ce-toolbar__settings-btn {
       background-color: #1F2937 !important;
       color: #9CA3AF !important; /* Default icon color */
       border: 1px solid #374151 !important;
     }
     .ce-toolbar__plus svg, .ce-toolbar__settings-btn svg {
        /* Ensure SVG inherits the color */
        fill: currentColor !important;
     }
     .ce-toolbar__plus:hover, .ce-toolbar__settings-btn:hover {
       background-color: #2D3748 !important;
       color: #F3F4F6 !important; /* Icon color brightens on hover */
     }

     /* Popovers (tool options), Conversion Toolbar, Inline Toolbar */
     .ce-popover, .ce-conversion-toolbar, .ce-inline-toolbar {
       background-color: #0b0d0f !important;
       border: 1px solid #1F2937 !important;
       color: #E5E7EB !important; /* Default text inside */
       box-shadow: 0 2px 5px rgba(0,0,0,0.3);
     }
     /* --- Inline Toolbar Specifics --- */
      .ce-inline-toolbar {
         padding: 4px 6px !important; /* Adjust padding if needed */
      }
      .ce-inline-tool {
         color: #9CA3AF !important; /* Default icon color for inline tools */
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
         background-color: #1F2937 !important;
         color: #F3F4F6 !important; /* Brighten icon on hover */
      }
      .ce-inline-tool--active {
         background-color: #2D3748 !important; /* Keep background subtle */
         color: #FFFFFF !important; /* Brightest color for active icon */
      }

      /* --- Popover/Conversion Tool Specifics --- */
      .ce-popover-item, .ce-conversion-tool {
        color: #E5E7EB !important; /* Tool text label */
        padding: 8px 12px !important; /* Adjust padding */
      }
      .ce-popover-item:hover, .ce-conversion-tool:hover {
        background-color: #1F2937 !important;
      }
      .ce-popover-item__icon, .ce-conversion-tool__icon {
        color: #9CA3AF !important; /* Icon next to text label */
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
       background-color: #111827 !important;
       border: 1px solid #1F2937 !important;
       color: #E5E7EB !important;
       padding: 8px 10px !important; /* Adjust padding */
       border-radius: 4px !important;
     }

     /* Code block styling */
    .ce-code__textarea {
       background-color: #0D1117 !important; /* Slightly darker common code bg */
       color: #E5E7EB !important;
       border: 1px solid #1F2937 !important;
       font-family: monospace;
       font-size: 0.9em;
       line-height: 1.5;
       border-radius: 4px;
       padding: 10px !important;
     }

     /* List item styling */
     .cdx-list__item {
       color: #E5E7EB !important; /* Use primary text color */
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
          color: #F3F4F6 !important; /* Ensure header text color */
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
        placeholder: "Body", 
        inlineToolbar: true, 
        data: { blocks: [] },
        tools: {
          header: {
            //@ts-ignore
            class: Header,
            inlineToolbar: true, 
            config: {
              placeholder: "Header",
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
    // Main container with updated dark background and padding
    <div className="w-full max-w-7xl mx-auto p-4 rounded-lg my-6">
      <h1 className="text-xl font-semibold text-[#B7CAD4] mb-4">Create post</h1>{" "}

      {/* Added Title */}
      {/* Form wrapping the editor elements */}
      <form id="subreddit-post-form" onSubmit={handleSubmit(onSubmit)}>

        {/* Community Selector Placeholder - Add your actual component here */}
        <div className="mb-4">
          <button
            type="button"
            className="flex items-center gap-2 rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-100 hover:border-zinc-600"
          >
            <span className="text-zinc-400">r/</span>
            Select a community{" "}
            {/* Replace with actual subreddit name/selector */}
            
          </button>
        </div>


        {/* Title Input */}
        <div className="relative mb-4">
          <TextareaAutosize
            ref={(e) => {
              titleRef(e); 
              // @ts-ignore Assign to local ref
              _titleRef.current = e;
            }}
            {...rest} 
            placeholder="Title*"
            className="w-full resize-none appearance-none overflow-hidden bg-[#0b0d0f] border border-zinc-700 rounded px-3 py-2 text-sm font-normal focus:outline-none focus:border-zinc-500 text-zinc-100 placeholder-zinc-500" // Updated styling
            maxLength={300} // 
          />

          {/* Character counter (visual placeholder) */}
          <span className="absolute bottom-2 right-2 text-xs text-zinc-500">
            {/* Add state logic here to update count */} 0/300
          </span>
        </div>

        {/* "Add tags" button placeholder */}
        <div className="mb-4">
          <button
            type="button"
            className="text-xs font-semibold text-zinc-400 border border-dashed border-zinc-600 rounded-full px-3 py-1 hover:border-zinc-500 hover:text-zinc-300"
          >
            Add tags
          </button>
        </div>

        {/* EditorJS Container - Updated background color */}
        <div
          id="editor"
          className="bg-[#0b0d0f] max-w-none"
        />
        {/* The 'prose' classes help with basic typography styling inside editor, adjust as needed */}

        {/* Action Buttons Container */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-zinc-800">
          <button
            type="button" // Change to submit if implementing save draft
            // Add onClick handler for saving draft logic
            disabled={isPosting} // Disable while posting
            className="px-4 py-1.5 rounded-full text-sm font-semibold bg-zinc-700 text-zinc-100 hover:bg-zinc-600 disabled:opacity-50"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={isPosting} // Disable while posting
            className="px-4 py-1.5 rounded-full text-sm font-semibold bg-zinc-100 text-zinc-900 hover:bg-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed" // Primary post button style
          >
            {isPosting ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Editor;