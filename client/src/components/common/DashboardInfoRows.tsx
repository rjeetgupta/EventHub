export function DashboardInfoRows({
  rows,
}: {
  rows: [string, string | number][];
}) {
  return (
    <div className="px-4 pb-3">
      {rows.map(([label, value]) => (
        <p
          className="flex justify-between gap-4 border-b border-border py-3 text-xs last:border-0"
          key={label}
        >
          <span className="text-muted-foreground">{label}</span>
          <b>{value}</b>
        </p>
      ))}
    </div>
  );
}
