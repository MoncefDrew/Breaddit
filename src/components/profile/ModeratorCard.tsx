'use client'

interface ModeratorCardProps {
  username: string
}

const ModeratorCard = ({ username }: ModeratorCardProps) => {
  return (
    <div className="bg-surface rounded-md overflow-hidden border border-custom mb-4">
      <div className="px-4 py-3 border-b border-custom flex items-center">
        <h2 className="text-[16px] font-medium text-primary">Moderator of these communities</h2>
      </div>
      
      <div className="p-12 flex items-center justify-center">
        <p className="text-sm text-muted">Not a moderator of any communities</p>
      </div>
    </div>
  )
}

export default ModeratorCard 