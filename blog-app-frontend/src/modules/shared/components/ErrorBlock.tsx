interface ErrorBlockProps {
  children: string;
}
export default function ErrorBlock({ children }: ErrorBlockProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
      <h2 className="text-error text-sm lg:text-base xl:text-lg">{children}</h2>
    </div>
  );
}
