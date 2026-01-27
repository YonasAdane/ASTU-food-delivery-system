
export default function RevenueBars({ series }: { series: number[] }) {
  const defaultDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const labels = series.length === 7 ? defaultDays : series.map((_, i) => String(i + 1));

  return (
    <div className="h-64 flex items-end gap-2 px-2 border-l border-b border-border relative mb-6">
      {series.map((val, idx) => {
        const isLast = idx === series.length - 1;
        return (
          <div
            key={idx}
            style={{ height: `${val}%` }}
            className={`flex-1 transition-colors rounded-t relative group ${
              isLast ? 'bg-primary' : 'bg-primary/20 hover:bg-primary/40'
            }`}
          >
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block bg-popover text-popover-foreground text-[9px] px-2 py-1 rounded shadow-md border z-10 whitespace-nowrap">
              {isLast ? `Today: $${val}k` : `$${val}k`}
            </div>
          </div>
        );
      })}

      <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-2 text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">
        {labels.map((label, i) => <span key={i}>{label}</span>)}
      </div>
    </div>
  )
}