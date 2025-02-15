"use client";

import EditorJS from "@editorjs/editorjs";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";

interface EditorProps {
  subredditId: string;
}

const Editor: FC<EditorProps> = ({ subredditId }) => {
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

  const [isMounted, SetIsMounted] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      SetIsMounted(true);
    }
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
                async uploadByFile(file: File) {
                  // upload to uploadthing to make the uploading very easy
                  const [res] = await uploadFiles([file], "imageUploader");

                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
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
      });
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      await initializeEditor()
      
      setTimeout(() => {
        //set to focus


      })
    }

    if(isMounted){
      init()
      return ()=>{}
    }
  }, [isMounted, initializeEditor]);
  return (
    <div className="w-full p-4 bg-zinc-50 rounded-lg border border-zinc-200">
      <form id="submit-post-form" className="w-fit" onSubmit={() => {}}>
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-5xl font-bold focus:outline-none"
          />
          <div id='editor' className="min-h-[500px]"/>
        </div>
      </form>
    </div>
  );
};

export default Editor;
function uploadFiles(arg0: File[], arg1: string): [any] | PromiseLike<[any]> {
  throw new Error("Function not implemented.");
}
