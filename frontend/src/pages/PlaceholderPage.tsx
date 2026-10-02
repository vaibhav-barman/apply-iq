export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1">This feature is not yet implemented.</p>
      </div>
      <div className="border border-dashed border-border rounded-xl p-12 text-center bg-muted/30">
        <p className="text-muted-foreground text-sm">Coming in a later phase.</p>
      </div>
    </div>
  )
}
