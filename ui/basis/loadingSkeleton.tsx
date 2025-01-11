export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={`${className} w-16 bg-opacity-10`}>&nbsp;</div>;
}
