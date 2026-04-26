import type { ReactNode } from "react";

export default function LibraryEntryLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_200px]">
      {children}
    </div>
  );
}
