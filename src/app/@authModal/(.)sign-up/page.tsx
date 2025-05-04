import CloseModal from "@/components/CloseModal";
import SignUp from "@/components/SignUp";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="fixed inset-0 bg-black/40 z-10 backdrop-blur-sm">
      <div className="container flex items-center h-full max-w-md">
        <div className="relative bg-white w-full h-fit py-12 px-2 rounded-lg border border-[#e2e8f0] shadow-lg">
          <div className="absolute top-4 right-4">
            <CloseModal />
          </div>
          <SignUp />
        </div>
      </div>
    </div>
  );
};

export default page;
