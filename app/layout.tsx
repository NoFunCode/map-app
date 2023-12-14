import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Map App",
  description: "University Web Analytics Project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col items-center justify-between py-4">
          <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
            <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
              Disclaimer&nbsp;
              <code className="font-mono font-bold">incomplete data</code>
            </p>
            <nav className="mb-32 flex justify-center lg:mb-0">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="/"
                      className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                    >
                      <h1 className={`mb-3 text-2xl font-semibold`}>
                        Map App{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                          -&gt;
                        </span>
                      </h1>
                      <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                        Web Analytics University Project.
                      </p>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Center Map</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </nav>
            <div className="bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
              <a
                className="me-2 group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                href="https://github.com/NoFunCode/map-app"
                target="_blank"
                rel="noopener noreferrer"
              >
                Code for MapApp
              </a>
              <a
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                href="https://github.com/NoFunCode/map-data"
                target="_blank"
                rel="noopener noreferrer"
              >
                Code for Data
              </a>
            </div>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
