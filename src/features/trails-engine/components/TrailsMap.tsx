import Link from "next/link";
import type { Trail } from "../services";

interface TrailsMapProps {
  trails: Trail[];
}

export function TrailsMap({ trails }: TrailsMapProps) {
  if (trails.length === 0) {
    return <p className="text-sm text-gray-500">Nenhuma trilha disponível ainda.</p>;
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {trails.map((trail) => (
        <li key={trail.id}>
          <Link
            href={`/trails/${trail.id}`}
            className="block rounded-lg border p-4 hover:border-black transition-colors"
          >
            <span className="text-xs text-gray-500">Trilha {trail.sequence}</span>
            <h2 className="text-lg font-medium">{trail.theme}</h2>
          </Link>
        </li>
      ))}
    </ul>
  );
}