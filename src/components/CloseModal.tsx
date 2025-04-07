'use client'
import { FC } from "react";
import { Button } from "./ui/Button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";


const CloseModal = () => {
    const router = useRouter()
    
  return (
    <Button
      onClick={()=> router.back()}
      variant="ghost"
      className="h-6 w-6 p-0 rounded-md bg-transparent text-muted hover:bg-surface-dark hover:text-primary focus:ring-custom"
      aria-label="close modal"
    >
      <X className="h-4 w-4" />
    </Button>
  );
};

export default CloseModal;
