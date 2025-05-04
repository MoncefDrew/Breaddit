'use client'

import { useToast } from "@/hooks/use-toast";

const PremiumButton = () => {
  const { toast } = useToast();
  
  const handlePremiumClick = () => {
    toast({
      title: "Feature not available",
      description: "Reddit Premium is not available yet. Check back soon!",
      variant: "default",
    });
  };
  
  return (
    <button 
      onClick={handlePremiumClick}
      className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium py-2 px-4 rounded-full text-sm w-full hover:opacity-90 transition-opacity"
    >
      Try Now
    </button>
  );
};

export default PremiumButton; 