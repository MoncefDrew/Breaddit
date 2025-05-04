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
    <div className="container flex items-center h-full max-w-2xl mx-auto py-10">
      <div className="w-full h-fit bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-800">Create a Community</h1>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Guidelines Section */}
          <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-gray-500 mt-0.5" />
              <div>
                <h2 className="text-sm font-medium text-gray-800 mb-2">Community Guidelines</h2>
                <ul className="text-sm space-y-2 text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    Names must be between 3-21 characters
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    Only letters, numbers, and underscores allowed
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    Cannot be changed once created
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Name Input Section */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-sm font-medium text-gray-700">Community Name</h2>
              {input.length > 0 && (input.length < 3 || input.length > 21) && (
                <div className="flex items-center gap-1 text-red-500 text-xs">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Must be between 3-21 characters</span>
                </div>
              )}
            </div>

            <div className="relative">
              <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-gray-600 font-medium">
                r/
              </p>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="pl-6 bg-white border-gray-300 text-gray-800 focus:ring-orange-200 focus:border-orange-300 focus:ring-1"
                placeholder="community-name"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 flex justify-end gap-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button 
            onClick={() => router.back()}
            className="px-4 py-1.5 border border-gray-300 text-gray-700 text-xs rounded-md hover:bg-gray-50 transition-colors duration-150"
          >
            Cancel
          </button>
          <button
            disabled={input.length < 3 || input.length > 21 || isLoading}
            onClick={() => createCommunity()}
            className="px-4 py-1.5 border border-orange-300 text-orange-500 text-xs rounded-md hover:bg-orange-50 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Community'}
          </button>
        </div>
      </div>
    </div>
  );
}