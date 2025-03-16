"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CreateSubredditPayload } from "@/lib/validators/subreddit";
import { toast, useToast } from "@/hooks/use-toast";
import { error } from "console";
import { useCustomToast } from "@/hooks/use-custom-toast";

export default function Page() {
  const [input, setInput] = useState<string>("");

  // we used useRouter to navigate between different pages
  const router = useRouter();

  //destructuring the login toast 
  const {loginToast} = useCustomToast()


  // useMutation is a hook from reactquery library which can interact with
  // the application api and the api used here is axios
  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      };

      const { data } = await axios.post("/api/subreddit", payload);
      return data as string;
    },
    onError:(err) =>{
      if(err instanceof AxiosError){
        if(err.response?.status === 409){
          return toast({
            title: 'Subreddit Already Exists',
            description: 'Please choose a different subreddit name.',
            variant : 'destructive'
          })
        }
        if(err.response?.status === 422){
          return toast({
            title: 'Invalid Already Name',
            description: 'Please choose a name between 3 and 21 characters.',
            variant : 'destructive'
          })
        }
        if(err.response?.status === 401){
          return loginToast()
        }
      }

      toast({
        title:'There was an error',
        description:'Could not create subreddit',
        variant:'destructive',
      })
    },
    onSuccess: (data) => {
      router.push(`/r/${data}`)
    }
  });

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto py-10">
      <div className="relative bg-[#1A1A1B] w-full md:w-3/4 h-fit p-6 rounded-lg space-y-6 border border-[#343536] shadow-lg">
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold text-[#D7DADC]">Create a Community</div>
        </div>

        <hr className="border-[#343536] h-px" />

        <div>
          <p className="text-lg font-medium text-[#D7DADC]">Name</p>
          <p className="text-xs pb-2 text-[#818384]">
            Community names including capitalization cannot be changed
          </p>

          <div className="relative mt-3">
            <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-[#FF4500] font-medium">
              r/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-6 bg-[#272729] border-[#343536] text-[#D7DADC] focus:ring-[#FF4500] focus:border-[#FF4500] focus:ring-1"
            />
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-2">
          <Button 
            variant="subtle" 
            onClick={() => router.back()}
            className="bg-[#2D2D2F] text-[#D7DADC] hover:bg-[#343536]"
          >
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => createCommunity()}
            className="bg-[#FF4500] hover:bg-[#FF5414] text-white disabled:bg-[#FF4500]/50"
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
};

