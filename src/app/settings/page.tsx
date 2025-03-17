import { UserNameForm } from '@/components/UserNameForm'
import { getAuthSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Settings',
  description: 'Manage account and website settings.',
}

export default async function SettingsPage() {
  const session = await getAuthSession();

  if(!session?.user) {
    redirect('/sign-in');
  }
  
  return (
    <div className='min-h-screen bg-[#030303] text-[#D7DADC]'>
      <div className='max-w-4xl mx-auto py-6 sm:py-8 md:py-12 px-4 sm:px-6'>
        <div className='grid items-start gap-6 sm:gap-8'>
          <h1 className='font-bold text-2xl sm:text-3xl md:text-4xl text-[#D7DADC]'>Settings</h1>
            
              <div className="grid gap-6 sm:gap-10 w-full">
                <UserNameForm
                  user={{
                    id: session?.user.id,
                    username: session?.user.username || '',
                  }}
                />
              </div>
        </div>
      </div>
    </div>
  )
}