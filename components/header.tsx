"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const TRIPLE_CLICK_MS = 800;

export function Header() {
  const router = useRouter();
  const clicksRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleLogoClick(e: React.MouseEvent) {
    clicksRef.current += 1;
    if (timerRef.current) clearTimeout(timerRef.current);

    if (clicksRef.current >= 3) {
      e.preventDefault();
      clicksRef.current = 0;
      router.push("/admin/login");
      return;
    }

    timerRef.current = setTimeout(() => {
      clicksRef.current = 0;
    }, TRIPLE_CLICK_MS);
  }

  return (
    <header className="absolute inset-x-0 top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 safe-px safe-pt-header pb-3 md:px-6">
        <Link
          href="/"
          className="flex min-h-11 min-w-0 items-center gap-2.5 sm:gap-3"
          onClick={handleLogoClick}
          aria-label="Impulso Criativo"
        >
          <Image
            src="/logo.png"
            alt="Impulso Criativo"
            width={48}
            height={48}
            className="h-10 w-10 shrink-0 rounded-full object-cover sm:h-11 sm:w-11"
            priority
          />
          <p className="truncate text-sm font-semibold tracking-wide text-white sm:text-[15px]">
            Soluções em Tecnologia
          </p>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-slate-300 lg:flex">
          <a href="#como-funciona" className="transition hover:text-white">
            Como funciona
          </a>
          <a href="#beneficios" className="transition hover:text-white">
            Benefícios
          </a>
          <a href="#contato" className="transition hover:text-white">
            Contato
          </a>
        </nav>

        <Button asChild size="sm" className="shrink-0 touch-target px-3 sm:px-5">
          <a href="#diagnostico">Iniciar Diagnóstico</a>
        </Button>
      </div>
    </header>
  );
}
