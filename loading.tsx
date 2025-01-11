import { LoadingSkeleton } from "@/ui/basis/loadingSkeleton";

export default function Loading({ className }: { className?: string }) {
  return <LoadingSkeleton className={className} />;
}
