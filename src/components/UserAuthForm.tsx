"use client"

import { FC,useState } from "react";
import { Button } from "./ui/Button";
import  { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Icons } from "./Icons";
import {useToast} from "@/hooks/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement>{}

const UserAuthForm : FC<UserAuthFormProps> = ({className, ...props}) => {

        const [isLoading, setIsLoading] = useState<boolean>(false);
        const {toast} = useToast();

        const LoginWithGoogle = async () => {
            setIsLoading(true);
            
            try {
                await signIn('google')
            } catch (error) {
                //toast notification
                toast({
                    title :"There was a problem",
                    description : " There was an error logging in with  google",
                    variant: "destructive"
                })
            } 
            finally {
                setIsLoading(false);
        }
            }
        
        return (
            <div className={cn('flex justify-center',className)} {...props}>
                <Button onClick={LoginWithGoogle}
                    isLoading={isLoading}
                    size="sm"
                    className="w-full ">{isLoading ? null : <Icons.google className="h-4 w-4 mr-2"/>}Google</Button>
            </div>

        );
    }




export default UserAuthForm