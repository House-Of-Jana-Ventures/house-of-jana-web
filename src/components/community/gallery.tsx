"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useState, type KeyboardEvent } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Reveal } from "@/components/site/reveal";

interface Photo {
  src: string;
  alt: string;
}

/** A grid of photos; tap one to see it large, then the arrows (or ← →) to move. */
export function Gallery({ photos }: { photos: Photo[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const count = photos.length;
  const step = useCallback(
    (by: number) => setIndex((i) => (i === null ? i : (i + by + count) % count)),
    [count],
  );
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") step(1);
    if (event.key === "ArrowLeft") step(-1);
  };
  const current = index === null ? null : photos[index];

  return (
    <>
      <ul className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {photos.map((photo, i) => (
          <li key={photo.src}>
            <Reveal zoom delay={0.06 * (i % 4)}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`View larger: ${photo.alt}`}
                className="group relative block aspect-square w-full overflow-hidden rounded-2xl bg-white ring-1 ring-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jh-bright"
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-1"
                />
              </button>
            </Reveal>
          </li>
        ))}
      </ul>

      <Dialog open={index !== null} onOpenChange={(open) => !open && setIndex(null)}>
        <DialogContent
          showCloseButton={false}
          onKeyDown={onKeyDown}
          className="max-w-[min(92vw,44rem)] gap-0 overflow-hidden bg-white p-0 sm:max-w-[min(92vw,44rem)]"
        >
          {current ? (
            <>
              <DialogTitle className="sr-only">{current.alt}</DialogTitle>
              <div className="relative aspect-square w-full">
                <Image src={current.src} alt={current.alt} fill sizes="44rem" className="object-contain" />
              </div>
              <div className="flex items-center justify-between gap-3 p-3">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className="flex size-10 items-center justify-center rounded-full hover:bg-muted focus-visible:outline-2 focus-visible:outline-jh-bright"
                >
                  <ChevronLeft aria-hidden className="size-5" />
                </button>
                <p className="text-center text-sm text-muted-foreground">
                  {current.alt} · {index! + 1} of {count}
                </p>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className="flex size-10 items-center justify-center rounded-full hover:bg-muted focus-visible:outline-2 focus-visible:outline-jh-bright"
                >
                  <ChevronRight aria-hidden className="size-5" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIndex(null)}
                aria-label="Close"
                className="absolute top-3 right-3 flex size-10 items-center justify-center rounded-full bg-white/90 shadow focus-visible:outline-2 focus-visible:outline-jh-bright"
              >
                <X aria-hidden className="size-5" />
              </button>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
