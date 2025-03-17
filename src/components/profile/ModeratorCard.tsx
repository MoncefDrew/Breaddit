'use client'

interface ModeratorCardProps {
  username: string
}

const ModeratorCard = ({ username }: ModeratorCardProps) => {
  return (
    <div className="bg-[#1A1A1B] rounded-md overflow-hidden border border-[#343536] mb-4">
      <div className="px-4 py-3 border-b border-[#343536] flex items-center">
        <h2 className="text-[16px] font-medium text-[#D7DADC]">Moderator of these communities</h2>
      </div>
      
      <div className="p-12 flex items-center justify-center">
        <p className="text-sm text-[#818384]">Not a moderator of any communities</p>
      </div>
    </div>
  )
}

export default ModeratorCard 