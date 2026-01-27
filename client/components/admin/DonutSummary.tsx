// components/admin/DonutSummary.tsx

interface DataPoint {
  label: string;
  value: number;
}

export default function DonutSummary({ data, totalCount = "1.4k" }: { data: DataPoint[], totalCount?: string }) {
  // Mapping the colors from your original HTML
  const colors: Record<string, string> = {
    'Delivered': '#1bac99',
    'Preparing': '#e9c46a',
    'En Route': '#3498db',
    'Pending': '#27ae60',
    'Canceled': '#eb5757',
  };

  const bgColors: Record<string, string> = {
    'Delivered': 'bg-primary', // mapping to shadcn primary
    'Preparing': 'bg-yellow-500',
    'En Route': 'bg-blue-500',
    'Pending': 'bg-green-600',
    'Canceled': 'bg-red-500',
  };

  // Create the conic gradient string based on data percentages
  let currentPercentage = 0;
  const gradientStops = data.map((item) => {
    const start = currentPercentage;
    currentPercentage += item.value;
    return `${colors[item.label] || '#ccc'} ${start}% ${currentPercentage}%`;
  }).join(', ');

  return (
    <div className="w-full">
      <div className="flex justify-center mb-6">
        <div className="relative size-48">
          <div
            className="size-full rounded-full border-[16px] border-primary/10"
            style={{ background: `conic-gradient(${gradientStops})` }}
          ></div>
          <div className="absolute inset-0 m-[16px] bg-background dark:bg-slate-950 rounded-full flex flex-col items-center justify-center">
            <span className="text-2xl font-black">{totalCount}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">
              Total Today
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-3 gap-x-4">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={`size-2 rounded-full ${bgColors[item.label]}`}></span>
            <span className="text-[11px] text-muted-foreground">{item.label}</span>
            <span className="ml-auto text-[11px] font-bold">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}