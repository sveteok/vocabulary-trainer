"use client";

import { useEffect, useState } from "react";

import { ErrorDisplay } from "@/ui/basis/errorDisplay";
export default function Error({
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
    <>
      <h2>App Page Error</h2> <ErrorDisplay message={message} reset={reset} />
    </>
  );
}
