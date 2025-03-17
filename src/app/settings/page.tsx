import { redirect } from 'next/navigation'
import { UserNameForm } from '@/components/UserNameForm'
import { authOptions, getAuthSession } from '@/lib/auth'
import ProfilePage from '@/components/profile/ProfilePage'
import { db } from '@/lib/db'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'

export const metadata = {
  title: 'Settings',
  description: 'Manage account and website settings.',
}

export default async function SettingsPage() {
  const session = await getAuthSession()

  if (!session?.user) {
    redirect(authOptions?.pages?.signIn || '/login')
  }

  // Fetch user profile data
  const user = await db.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      username: true,
      image: true, // This will be used as profilePicture
      // Add any other fields you want to fetch
    },
  })

  if (!user) {
    redirect('/')
  }

  return (
    <div className='min-h-screen bg-[#030303] text-[#D7DADC]'>
      <div className='max-w-4xl mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6'>
        <div className='grid items-start gap-6 sm:gap-8'>
          <h1 className='font-bold text-2xl sm:text-3xl md:text-4xl text-[#D7DADC]'>Settings</h1>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="bg-[#1A1A1B] border border-[#343536]">
              <TabsTrigger 
                value="profile" 
                className="data-[state=active]:bg-[#272729] data-[state=active]:text-[#D7DADC] text-[#818384]"
              >
                Profile
              </TabsTrigger>
              <TabsTrigger 
                value="account" 
                className="data-[state=active]:bg-[#272729] data-[state=active]:text-[#D7DADC] text-[#818384]"
              >
                Account
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
              <ProfilePage 
                user={{
                  id: user.id,
                  username: user.username || '',
                  profilePicture: user.image,
                  coverImage: null, // Add this field to your database if needed
                  bio: null, // Add this field to your database if needed
                }}
              />
            </TabsContent>
            
            <TabsContent value="account" className="mt-6">
              <div className="grid gap-6 sm:gap-10 w-full">
                <UserNameForm
                  user={{
                    id: user.id,
                    username: user.username || '',
                  }}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}