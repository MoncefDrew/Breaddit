import { ReactNode } from "react";

const Layout = async ({
  children,
  params: { user },
}: {
  children: ReactNode;
  params: { user: string };
}) => {
  return (
    <div className=" max-w-5xl mx-auto h-full pt-6 pb-12 bg-gray-50">
        {children}
    </div>
  );
};

export default Layout;
