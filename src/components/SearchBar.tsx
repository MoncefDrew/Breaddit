'use client'

import { Prisma, Subreddit } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import debounce from 'lodash.debounce'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useCallback, useEffect, useRef, useState } from 'react'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/Command'
import { useOnClickOutside } from '@/hooks/use-on-click-outside'
import { Search, Users } from 'lucide-react'
import { Avatar } from './ui/Avatar'
import UserAvatar from './UserAvatar'

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [input, setInput] = useState<string>('')
  const pathname = usePathname()
  const commandRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useOnClickOutside(commandRef, () => {
    setInput('')
  })

  const request = debounce(async () => {
    refetch()
  }, 300)

  const debounceRequest = useCallback(() => {
    request()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const {
    isFetching,
    data: queryResults,
    refetch,
    isFetched,
  } = useQuery({
    queryFn: async () => {
      if (!input) return []
      const { data } = await axios.get(`/api/search?q=${input}`)
      return data as (Subreddit & {
        _count: Prisma.SubredditCountOutputType
      })[]
    },
    queryKey: ['search-query'],
    enabled: false,
  })

  useEffect(() => {
    setInput('')
  }, [pathname])

  return (
    <div className="relative w-full max-w-lg">
      <div className="rounded-full border border-custom w-full overflow-hidden bg-surface-dark-hover transition-all duration-200 hover:border-custom focus-within:border-custom shadow-sm">
        <div className="flex items-center px-3">
          <Search className="h-4 w-4 text-muted mr-2 flex-shrink-0" />
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              debounceRequest()
            }}
            className="w-full py-2 pr-3 bg-transparent text-primary placeholder:text-stone-400 outline-none border-none focus:outline-none focus:ring-0 focus:border-none"
            placeholder="Search communities..."
            style={{ boxShadow: 'none' }}
          />
        </div>
      </div>

      {input.length > 0 && (
        <div className="absolute bg-[#0E1113]  top-full inset-x-0 shadow-lg rounded-md border border-custom mt-1 overflow-hidden z-50 max-h-[300px] overflow-y-auto">
          {isFetched && (!queryResults || queryResults.length === 0) && (
            <div className="text-muted py-6 flex items-center justify-center">
              <div className="text-center">
                <p>No communities found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            </div>
          )}
          {(queryResults?.length ?? 0) > 0 ? (
            <div>
              <div className="text-muted text-[10px] uppercase font-medium px-3 py-1.5 tracking-wider">
                Communities
              </div>
              <div>
                {queryResults?.map((subreddit) => (
                  <div
                    key={subreddit.id}
                    className="px-4 py-3 cursor-pointer hover:bg-surface-dark-hover text-primary transition-colors duration-200"
                    onClick={() => {
                      router.push(`/r/${subreddit.name}`)
                      router.refresh()
                    }}
                  >
                    <div className="flex items-center">
                      <div className=" rounded-full  mr-3">
                        <UserAvatar className="h-7 w-7 text-white" user={subreddit} />
                      </div>
                      <div>
                        <p className="font-medium">r/{subreddit.name}</p>
                        <p className="text-xs text-muted">{subreddit._count.posts} posts</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default SearchBar