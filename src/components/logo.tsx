import Image from "next/image";
import Link from "@/i18n/link";

export function Logo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" aria-label="Flores Roastery — ana sayfa" className={`group flex items-center gap-3 ${className}`}>
      <Image
        src="/logo.webp"
        alt="Flores Roastery çiçek logosu"
        width={40}
        height={40}
        preload
        className="size-9 transition-transform duration-700 ease-out group-hover:rotate-45 md:size-10"
      />
      {!compact && (
        <span className="flex flex-col leading-none" lang="en">
          <span className="font-serif text-[1.35rem] tracking-[0.18em]">FLORES</span>
          <span className="mt-1 text-[0.55rem] font-medium tracking-[0.48em] text-cream-400">ROASTERY</span>
        </span>
      )}
    </Link>
  );
}
