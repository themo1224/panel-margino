type ComingSoonProps = {
  title: string;
  description?: string;
};

/** Lightweight placeholder for surfaces not yet built. */
export default function ComingSoon({
  title,
  description = "به‌زودی",
}: ComingSoonProps) {
  return (
    <div className="flex max-w-3xl flex-col gap-2 px-1 py-8">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
