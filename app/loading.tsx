import { Skeleton } from "@/components/ui/skeleton";

// Page fantôme pendant le chargement d'une route : la structure apparaît tout de suite, le contenu la remplace.
export default function Loading() {
  return (
    <div className="container py-16 md:py-24" role="status" aria-label="Chargement de la page">
      <Skeleton className="h-3 w-28 rounded-full" />
      <Skeleton className="mt-6 h-12 w-full max-w-2xl rounded-full md:h-16" />
      <Skeleton className="mt-4 h-12 w-2/3 max-w-xl rounded-full md:h-16" />
      <div className="mt-10 max-w-xl space-y-3">
        <Skeleton className="h-3 w-full rounded-full" />
        <Skeleton className="h-3 w-11/12 rounded-full" />
        <Skeleton className="h-3 w-3/4 rounded-full" />
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <Skeleton className="h-56 rounded-xl" />
        <Skeleton className="h-56 rounded-xl" />
      </div>
    </div>
  );
}
