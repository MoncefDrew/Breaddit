import { ReactNode } from "react";

const Layout = async ({
  children,
  params: { user },
}: {
  children: ReactNode;
  params: { user: string };
}) => {
  return (
    <div className="sm:container max-w-6xl mx-auto h-full pt-8 bg-surface">
      <div className="px-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;
