import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleX, Rocket, TriangleAlert } from 'lucide-react';

interface OrderStatsProps {
  total: number;
  complaints: number;
  canceled: number;
}

export function OrderStats({ total, complaints, canceled }: OrderStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatCard title="Live Orders" value={total} trend="+12.5%" color="green-500" icon={<Rocket className='text-green-500' />} />
      <StatCard title="Urgent Complaints" value={complaints} trend="Urgent" color="yellow-500" icon={<TriangleAlert className='text-yellow-500'  />} />
      <StatCard title="Canceled Today" value={canceled} trend="+1%" color="red-500" icon={<CircleX className='text-red-500' />} />
    </div>
  );
}

function StatCard({ title, value, trend, color, icon }: any) {
  return (
    <Card className="hover:border-primary/50 transition-all p-0">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2 bg-${color}/10 rounded-lg `}>
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <Badge variant={color === 'destructive' ? 'destructive' : 'secondary'}>{trend}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-3xl font-black mt-1">{value}</p>
      </CardContent>
    </Card>
  );
}