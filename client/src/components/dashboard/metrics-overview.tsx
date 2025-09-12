import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Percent, DollarSign } from "lucide-react";

interface MetricsData {
  activeCampaigns: number;
  totalLeads: number;
  conversionRate: string;
  roi: string;
  growth: {
    campaigns: string;
    leads: string;
    conversions: string;
    roi: string;
  };
}

interface MetricsOverviewProps {
  data: MetricsData;
}

export default function MetricsOverview({ data }: MetricsOverviewProps) {
  const metrics = [
    {
      title: "Active Campaigns",
      value: data.activeCampaigns,
      growth: data.growth.campaigns,
      icon: TrendingUp,
      color: "primary"
    },
    {
      title: "Total Leads",
      value: data.totalLeads.toLocaleString(),
      growth: data.growth.leads,
      icon: Users,
      color: "accent"
    },
    {
      title: "Conversion Rate",
      value: data.conversionRate,
      growth: data.growth.conversions,
      icon: Percent,
      color: "chart-3"
    },
    {
      title: "Monthly ROI",
      value: data.roi,
      growth: data.growth.roi,
      icon: DollarSign,
      color: "destructive"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="metrics-overview">
      {metrics.map((metric, index) => (
        <Card key={metric.title} data-testid={`metric-card-${index}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground" data-testid={`metric-title-${index}`}>
                  {metric.title}
                </p>
                <p className="text-2xl font-semibold text-foreground mt-2" data-testid={`metric-value-${index}`}>
                  {metric.value}
                </p>
              </div>
              <div className={`w-8 h-8 bg-${metric.color}/10 rounded-md flex items-center justify-center`}>
                <metric.icon className={`text-${metric.color} h-4 w-4`} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="text-accent mr-1 h-3 w-3" />
              <span className="text-accent font-medium" data-testid={`metric-growth-${index}`}>
                {metric.growth}
              </span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
