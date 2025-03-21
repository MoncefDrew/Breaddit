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
type FormData = z.infer<typeof PostValidator>

export const Editor: FC<EditorProps> = ({ subredditId }) => {
  //destructuring a use form object
  const {
    // register is a function used to register input fields into the form state.
    //You attach this to form inputs to track their value and validation.
    register,

    //handleSubmit: A function used to handle form submissions.
    // You wrap your submission handler with it,
    //and it takes care of validation before calling your handler.
    handleSubmit,

    //formState: destructures errors from the form state.
    formState: { errors },
  } = useForm<PostCreationRequest>({
    //options passed to useform
    resolver: zodResolver(PostValidator),
    defaultValues: {
      subredditId,
      title: "",
      content: null,
    },
  });

  const ref = useRef<EditorJS>();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const _titleRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()
  const pathname = usePathname();
  
  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      subredditId,
    }: PostCreationRequest) => {
      const payload: PostCreationRequest = { title, content, subredditId }
      const { data } = await axios.post('/api/subreddit/post/create', payload)
      return data
    },
    onError: () => {
      return toast({
        title: 'Something went wrong.',
        description: 'Your post was not published. Please try again.',
        variant: 'destructive',
      })
    },
    onSuccess: () => {
      // turn pathname /r/mycommunity/submit into /r/mycommunity
      const newPathname = pathname.split('/').slice(0, -1).join('/')
      router.push(newPathname)

      router.refresh()

      return toast({
        description: 'Your post has been published.',
      })
    },
  })

  // Update the dark mode CSS with theme variables
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .codex-editor {
        color: var(--color-text-primary) !important;
      }
      .ce-block--selected .ce-block__content {
        background: var(--color-surface-dark-hover) !important;
      }
      .ce-toolbar__plus, .ce-toolbar__settings-btn {
        background-color: var(--color-surface-dark-hover) !important;
        color: var(--color-text-primary) !important;
        border-color: var(--color-border-dark-custom) !important;
      }
      .ce-toolbar__plus:hover, .ce-toolbar__settings-btn:hover {
        background-color: var(--color-surface-dark-hover) !important;
      }
      .ce-popover {
        background-color: var(--color-surface-dark) !important;
        border-color: var(--color-border-dark-custom) !important;
        color: var(--color-text-primary) !important;
      }
      .ce-popover-item {
        color: var(--color-text-primary) !important;
      }
      .ce-popover-item:hover {
        background-color: var(--color-surface-dark-hover) !important;
      }
      .ce-popover-item__icon {
        color: var(--color-text-muted) !important;
        background-color: var(--color-surface-dark-hover) !important;
      }
      .ce-popover__search {
        background-color: var(--color-surface-dark-hover) !important;
        border-color: var(--color-border-dark-custom) !important;
        color: var(--color-text-primary) !important;
      }
      .cdx-search-field {
        background-color: var(--color-surface-dark-hover) !important;
        border-color: var(--color-border-dark-custom) !important;
        color: var(--color-text-primary) !important;
      }
      .ce-inline-tool {
        color: var(--color-text-primary) !important;
      }
      .ce-inline-toolbar {
        background-color: var(--color-surface-dark) !important;
        border-color: var(--color-border-dark-custom) !important;
      }
      .ce-conversion-toolbar {
        background-color: var(--color-surface-dark) !important;
        border-color: var(--color-border-dark-custom) !important;
      }
      .ce-conversion-tool {
        color: var(--color-text-primary) !important;
      }
      .ce-conversion-tool:hover {
        background-color: var(--color-surface-dark-hover) !important;
      }
      .ce-conversion-tool__icon {
        background-color: var(--color-surface-dark-hover) !important;
      }
      .cdx-settings-button {
        color: var(--color-text-primary) !important;
      }
      .ce-toolbar__plus-close, .ce-toolbar__close {
        color: var(--color-text-primary) !important;
      }
      .cdx-input {
        background-color: var(--color-surface-dark-hover) !important;
        border-color: var(--color-border-dark-custom) !important;
        color: var(--color-text-primary) !important;
      }
      .ce-code__textarea {
        background-color: var(--color-surface-dark-hover) !important;
        color: var(--color-text-primary) !important;
        border-color: var(--color-border-dark-custom) !important;
      }
      .cdx-list__item {
        color: var(--color-text-primary) !important;
      }
      .cdx-block {
        color: var(--color-text-primary) !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  //doing a dynamic imports to javascript plugins
  //we usually do that cuz editor.js and its plugins are likely large libraries.
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
      //editor {holder ,onReady() ,placeholder ,inlinetoolbar ,data ,tools}
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
        },
        placeholder: "Type here to write your post...",
        inlineToolbar: true,
        data: { blocks: [] },
        //tools{header ,linkTool ,image,list ,code, table, inlinecode, embed}
        tools: {
          header: Header,
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
                //! took me 1 hour to resolve it
                async uploadByFile(file: File) {
                  const [res] = await uploadFiles("imageUploader", {
                    files: [file],
                  });
                  return {
                    success: 1,
                    file: {
                      url: res.ufsUrl,
                    },
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
        theme: {
          paragraph: {
            text: {
              color: '#F0F6FC',
            },
          },
          header: {
            text: {
              color: '#F0F6FC',
            },
          },
        },
      });
    }
  }, []);


  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);


  useEffect(() => {
    if (Object.keys(errors).length) {
      for (const [_key, value] of Object.entries(errors)) {
        value
        toast({
          title: 'Something went wrong.',
          description: (value as { message: string }).message,
          variant: 'destructive',
        })
      }
    }
  }, [errors])
  
  
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
    const blocks = await ref.current?.save()

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
      subredditId,
    }

    createPost(payload)
  }

  const { ref: titleRef, ...rest } = register("title");

  
  return (
    <div className="w-full p-4 bg-surface">
      <form
        id='subreddit-post-form'
        className='w-fit'
        onSubmit={handleSubmit(onSubmit)}>
        <div className='prose prose-stone dark:prose-invert'>
          <TextareaAutosize
            ref={(e) => {
              titleRef(e)
              // @ts-ignore
              _titleRef.current = e
            }}
            {...rest}
            placeholder='Title'
            className='w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none text-primary placeholder:text-muted'
          />
          <div id='editor' className='min-h-[500px] text-primary' />
          <p className='text-sm text-muted'>
            Use{' '}
            <kbd className='rounded-md border border-custom bg-surface-dark-hover px-1 text-xs uppercase text-primary'>
              Tab
            </kbd>{' '}
            to open the command menu.
          </p>
        </div>
      </form>
    </div>
  );
};

export default Editor;
