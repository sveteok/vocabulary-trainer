import Link from "next/link";

export function NotFoundDisplay() {
  return (
    <div
      className={` 
            h-svh lg:max-w-[700px] m-auto w-full flex flex-col bg-natural-gray-200 text-natural-gray-800`}
    >
      <div className="flex flex-col bg-natural-gray-400 text-natural-gray-50  p-4 items-center gap-4 ">
        <h1 className="font-bold">Not Found</h1>
        <Link className="hover:underline text-sm" href="/">
          Return Home
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center gap-4 center">
        <div className="text-sm flex-1 p-4">&nbsp;</div>
        <div className="flex flex-col  gap-4 items-center">
          <h2 className="font-bold text-error-700">Something went wrong! </h2>
          <div>Could not find requested resource</div>
        </div>
        <div className="text-sm flex-1 p-4">&nbsp;</div>
      </div>
    </div>
  );
}
