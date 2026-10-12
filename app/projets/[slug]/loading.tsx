import { Skeleton } from "@/components/ui/skeleton";

// Page projet fantôme : même structure que la page (le visuel d'en-tête garde le nom de transition partagé, le
// morph depuis la carte se pose dessus, puis le vrai visuel le remplace).
export default function ProjectLoading() {
  return (
    <div className="container py-16 md:py-24" role="status" aria-label="Chargement du projet">
      <Skeleton className="h-3 w-32 rounded-full" />
      <Skeleton className="mt-10 h-3 w-56 rounded-full" />
      <Skeleton className="mt-5 h-12 w-full max-w-xl rounded-full md:h-16" />
      <Skeleton className="mt-3 h-12 w-1/2 max-w-md rounded-full md:h-16" />
      <div className="project-hero__media skeleton mt-12" />
      <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-10">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-7 w-2/3 rounded-full" />
            <Skeleton className="h-3 w-full rounded-full" />
            <Skeleton className="h-3 w-5/6 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
