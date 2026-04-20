import { CareerStateGraph } from '@/components/dashboard/CareerStateGraph';
import { ActionCenter } from '@/components/dashboard/ActionCenter';
import { StatsGrid } from '@/components/dashboard/StatsGrid';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Your career intelligence at a glance</p>
        </div>

        {/* Stats Grid */}
        <StatsGrid />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <CareerStateGraph confidenceScore={65} />
          <ActionCenter
            mustDo={[
              {
                id: '1',
                title: 'Complete GRE Quant Section 3',
                type: 'study',
                estimated_minutes: 60,
                completed: false,
              },
              {
                id: '2',
                title: 'Research 3 Universities',
                type: 'research',
                estimated_minutes: 30,
                completed: false,
              },
            ]}
            optional={[
              {
                id: '3',
                title: 'Connect with alumni on LinkedIn',
                type: 'networking',
                estimated_minutes: 20,
                completed: false,
              },
            ]}
            focusArea="GRE Quant - Algebra"
          />
        </div>
      </div>
    </div>
  );
}
