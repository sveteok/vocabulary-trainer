"use client"; // Error boundaries must be Client Components

import { useEffect, useState } from "react";

import { ErrorDisplay } from "@/ui/basis/errorDisplay";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
    setMessage(error.message);
  }, [error]);

  return (
    // global-error must include html and body tags
    <html>
      <body className="bg-natural-gray-100 items-center ">
        <div className="flex flex-1 flex-col items-center gap-4 p-4 bg-natural-gray-400 text-natural-gray-50">
          <div className="flex flex-col  text-natural-gray-50 items-center">
            <h1 className="font-bold">500</h1>
            <Link className="hover:underline" href={"/"}>
              Home Page
            </Link>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center gap-4 ">
          <div className="text-sm flex-1 p-4">&nbsp;</div>
          <div className="flex flex-col  gap-4 items-center">
            <h2 className="font-bold text-error-700">Something went wrong! </h2>
            <p>{message}</p>
          </div>
        </div>
      </body>
    </html>
  );
}
