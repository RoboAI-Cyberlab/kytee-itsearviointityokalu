export default function Box({ children }: { children: React.ReactNode }) {
  return (
    <aside className="rounded-md border bg-gray-50 p-4 [&>:first-child]:mt-0 [&_li]:leading-[1.4]">
      {children}
    </aside>
  );
}
