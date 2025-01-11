export function ErrorDisplay({
  message,
  reset,
}: {
  message: string | null;
  reset?: () => void;
}) {
  return (
    <div>
      <h2 className="text-error">Something went wrong! {message}</h2>
      <button className="bg-natural-gray-400" onClick={reset}>
        Try again - my component!
      </button>
    </div>
  );
}
