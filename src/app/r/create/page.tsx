"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CreateSubredditPayload } from "@/lib/validators/subreddit";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { AlertCircle, Info } from 'lucide-react';

export default function Page() {
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const { loginToast } = useCustomToast();

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      };
      const { data } = await axios.post("/api/subreddit", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: 'Subreddit Already Exists',
            description: 'Please choose a different subreddit name.',
            variant: 'destructive'
          })
        }
        if (err.response?.status === 422) {
          return toast({
            title: 'Invalid Name',
            description: 'Please choose a name between 3 and 21 characters.',
            variant: 'destructive'
          })
        }
        if (err.response?.status === 401) {
          return loginToast()
        }
      }

      toast({
        title: 'There was an error',
        description: 'Could not create subreddit',
        variant: 'destructive',
      })
    },
    onSuccess: (data) => {
      router.push(`/r/${data}`)
    }
  });

  return (
    <div className="container flex items-center h-full max-w-3xl mx-auto py-10">
      <div className="relative w-full h-fit rounded-lg space-y-6">
        {/* Header */}
        <div className="px-6 py-4 rounded-t-lg">
          <h1 className="text-xl font-semibold text-primary">Create a Community</h1>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Guidelines Section */}
          <div className="bg-surface-dark rounded-md p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-link mt-0.5" />
              <div>
                <h2 className="text-sm font-medium text-primary mb-2">Community Guidelines</h2>
                <ul className="text-sm space-y-2 text-muted">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    Names must be between 3-21 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    Only letters, numbers, and underscores allowed
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-success" />
                    Cannot be changed once created
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Name Input Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-lg font-medium text-primary">Community Name</h2>
              {input.length > 0 && (input.length < 3 || input.length > 21) && (
                <div className="flex items-center gap-1 text-error text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>Must be between 3-21 characters</span>
                </div>
              )}
            </div>

            <div className="relative">
              <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-primary font-medium">
                r/
              </p>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="pl-6 bg-surface-dark text-primary focus:ring-link focus:border-link focus:ring-1"
                placeholder="community-name"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 flex justify-end gap-4">
          <Button 
            variant="subtle" 
            onClick={() => router.back()}
            className="bg-surface-dark text-primary hover:bg-surface-dark-hover"
          >
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length < 3 || input.length > 21}
            onClick={() => createCommunity()}
            className="bg-[#238636] hover:bg-[#2ea043] text-white disabled:bg-[#1f6c2e3a]"
          >
            Create Community
          </Button>
        </div>
      </div>
    </div>
  );
}