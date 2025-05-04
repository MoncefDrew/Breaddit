import { getAuthSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { Comment, CommentVote, User } from '@prisma/client'
import CreateComment from './CreateComment'
import PostComment from './comments/PostComment'

type ExtendedComment = Comment & {
  votes: CommentVote[]
  author: User
  replies: ReplyComment[]
}

type ReplyComment = Comment & {
  votes: CommentVote[]
  author: User
}

interface CommentsSectionProps {
  postId: string
  comments: ExtendedComment[]
}

const CommentsSection = async ({ postId }: CommentsSectionProps) => {
  const session = await getAuthSession()

  const comments = await db.comment.findMany({
    where: {
      postId: postId,
      replyToId: null, // only fetch top-level comments
    },
    include: {
      author: true,
      votes: true,
      replies: {
        // first level replies
        include: {
          author: true,
          votes: true,
        },
      },
    },
  })

  return (
    <div className='flex flex-col gap-y-4 mt-6'>
      <h3 className='text-lg font-semibold text-gray-900 mb-2'>Discussion</h3>
      
      <hr className='w-full h-px my-4 border-gray-200' />

      <CreateComment postId={postId} />

      <div className='flex flex-col gap-y-6 mt-6'>
        {comments.length === 0 ? (
          <div className='text-center py-6'>
            <p className='text-gray-500 text-sm'>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments
            .filter((comment) => !comment.replyToId)
            .map((topLevelComment) => {
              const topLevelCommentVotesAmt = topLevelComment.votes.reduce(
                (acc, vote) => {
                  if (vote.type === 'UP') return acc + 1
                  if (vote.type === 'DOWN') return acc - 1
                  return acc
                },
                0
              )

              const topLevelCommentVote = topLevelComment.votes.find(
                (vote) => vote.userId === session?.user.id
              )

              return (
                <div key={topLevelComment.id} className='flex flex-col'>
                  <div className='mb-2'>
                    <PostComment
                      comment={topLevelComment}
                      currentVote={topLevelCommentVote}
                      votesAmt={topLevelCommentVotesAmt}
                      postId={postId}
                    />
                  </div>

                  {/* Render replies */}
                  {topLevelComment.replies.length > 0 && (
                    <div className='mt-2 space-y-4'>
                      {topLevelComment.replies
                        .sort((a, b) => b.votes.length - a.votes.length) // Sort replies by most liked
                        .map((reply) => {
                          const replyVotesAmt = reply.votes.reduce((acc, vote) => {
                            if (vote.type === 'UP') return acc + 1
                            if (vote.type === 'DOWN') return acc - 1
                            return acc
                          }, 0)

                          const replyVote = reply.votes.find(
                            (vote) => vote.userId === session?.user.id
                          )

                          return (
                            <div
                              key={reply.id}
                              className='ml-4 py-2 pl-4 border-l-2 border-gray-200'>
                              <PostComment
                                comment={reply}
                                currentVote={replyVote}
                                votesAmt={replyVotesAmt}
                                postId={postId}
                              />
                            </div>
                          )
                        })}
                    </div>
                  )}
                </div>
              )
            })
        )}
      </div>
    </div>
  )
}

export default CommentsSection