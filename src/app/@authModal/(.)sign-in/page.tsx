import CloseModal from "@/components/CloseModal";
import SignIn from "@/components/SignIn";
import { FC } from "react";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  return (
    <div className="fixed inset-0 bg-[#030303]/80 z-10 backdrop-blur-sm">
      <div className="container flex items-center h-full max-w-lg">
        <div className="relative bg-[#1A1A1B] w-full h-fit py-12 px-2 rounded-lg border border-[#343536]">
          <div className="absolute top-4 right-4">
            <CloseModal />
          </div>
          <SignIn />
        </div>
      </div>
    </div>
  );
};

export default page;
