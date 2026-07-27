import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-4 shadow-soft sm:p-6 md:p-8",
        className
      )}
    >
      {children}
    </div>
  );
}
