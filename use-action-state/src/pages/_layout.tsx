import "../styles.css";

import type { ReactNode } from "react";

type RootLayoutProps = { children: ReactNode };

export default async function RootLayout({ children }: RootLayoutProps) {
  const data = await getData();

  return (
    <>
      <title>{data.title}</title>
      <meta property="description" content={data.description} />
      <link rel="icon" type="image/png" href={data.icon} />
      <main className="flex items-center min-h-screen w-full justify-center p-6">
        {children}
      </main>
    </>
  );
}

const getData = async () => {
  const data = {
    title: "Hello",
    description: "An internet website!",
    icon: "/images/favicon.png",
  };

  return data;
};

export const getConfig = async () => {
  return {
    render: "static",
  };
};
