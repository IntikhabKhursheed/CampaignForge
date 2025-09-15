import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Users, DollarSign, Target, BarChart3 } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Campaign, Contact } from "@shared/models";

// Mock data for charts - in production this would come from analytics API
const performanceData = [
  { name: 'Week 1', leads: 120, conversions: 8, revenue: 2400 },
  { name: 'Week 2', leads: 180, conversions: 12, revenue: 3600 },
  { name: 'Week 3', leads: 160, conversions: 10, revenue: 3000 },
  { name: 'Week 4', leads: 220, conversions: 18, revenue: 5400 },
  { name: 'Week 5', leads: 190, conversions: 15, revenue: 4500 },
  { name: 'Week 6', leads: 240, conversions: 22, revenue: 6600 },
];

const channelData = [
  { name: 'Email', value: 45, color: 'hsl(var(--primary))' },
  { name: 'Social Media', value: 30, color: 'hsl(var(--chart-3))' },
  { name: 'Content', value: 15, color: 'hsl(var(--destructive))' },
  { name: 'Direct', value: 10, color: 'hsl(var(--accent))' },
];

const conversionFunnelData = [
  { stage: 'Visitors', count: 10000, percentage: 100 },
  { stage: 'Leads', count: 2500, percentage: 25 },
  { stage: 'Qualified', count: 500, percentage: 5 },
  { stage: 'Converted', count: 125, percentage: 1.25 },
];

export default function Analytics() {
  const { data: campaigns, isLoading: campaignsLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const { data: contacts, isLoading: contactsLoading } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  const isLoading = campaignsLoading || contactsLoading || metricsLoading;

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto" data-testid="analytics-loading">
        <Header
          title="Analytics"
          description="Comprehensive insights into your marketing performance and ROI."
        />
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-96 bg-muted rounded-lg"></div>
              <div className="h-96 bg-muted rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate analytics
  const totalLeads = campaigns?.reduce((sum, c) => {
    const metrics = c.metrics as any;
    return sum + (metrics?.leads || 0);
  }, 0) || 0;
  const totalConversions = campaigns?.reduce((sum, c) => {
    const metrics = c.metrics as any;
    return sum + (metrics?.conversions || 0);
  }, 0) || 0;
  const avgConversionRate = totalLeads > 0 ? ((totalConversions / totalLeads) * 100).toFixed(1) : "0.0";
  const avgROI = (campaigns?.length || 0) > 0 
    ? Math.round((campaigns || []).reduce((sum, c) => {
        const metrics = c.metrics as any;
        return sum + (metrics?.roi || 0);
      }, 0) / (campaigns?.length || 1))
    : 0;
  const estimatedRevenue = totalConversions * 300; // Assuming $300 per conversion

  const campaignsByType = campaigns?.reduce((acc, campaign) => {
    acc[campaign.type] = (acc[campaign.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const leadsByScore = contacts?.reduce((acc, contact) => {
    const score = contact.leadScore || 0;
    if (score >= 80) acc.hot++;
    else if (score >= 60) acc.warm++;
    else acc.cold++;
    return acc;
  }, { hot: 0, warm: 0, cold: 0 }) || { hot: 0, warm: 0, cold: 0 };

  return (
    <div className="flex-1 overflow-auto" data-testid="analytics">
      <Header
        title="Analytics"
        description="Comprehensive insights into your marketing performance and ROI."
      />

      <div className="p-6 space-y-6">
        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card data-testid="kpi-total-leads">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Leads</p>
                  <p className="text-2xl font-semibold text-foreground mt-2" data-testid="total-leads-value">
                    {totalLeads.toLocaleString()}
                  </p>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="text-accent mr-1 h-3 w-3" />
                <span className="text-accent font-medium">+23.1%</span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="kpi-conversion-rate">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-semibold text-foreground mt-2" data-testid="conversion-rate-value">
                    {avgConversionRate}%
                  </p>
                </div>
                <div className="w-8 h-8 bg-chart-3/10 rounded-md flex items-center justify-center">
                  <Target className="h-4 w-4 text-chart-3" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="text-accent mr-1 h-3 w-3" />
                <span className="text-accent font-medium">+1.2%</span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="kpi-avg-roi">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average ROI</p>
                  <p className="text-2xl font-semibold text-foreground mt-2" data-testid="avg-roi-value">
                    {avgROI}%
                  </p>
                </div>
                <div className="w-8 h-8 bg-destructive/10 rounded-md flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-destructive" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="text-accent mr-1 h-3 w-3" />
                <span className="text-accent font-medium">+45.3%</span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="kpi-estimated-revenue">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Est. Revenue</p>
                  <p className="text-2xl font-semibold text-foreground mt-2" data-testid="estimated-revenue-value">
                    ${estimatedRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="w-8 h-8 bg-accent/10 rounded-md flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-accent" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="text-accent mr-1 h-3 w-3" />
                <span className="text-accent font-medium">+18.7%</span>
                <span className="text-muted-foreground ml-1">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card data-testid="performance-trends-chart">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Performance Trends</CardTitle>
                <Select defaultValue="6weeks" data-testid="select-performance-period">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6weeks">Last 6 weeks</SelectItem>
                    <SelectItem value="3months">Last 3 months</SelectItem>
                    <SelectItem value="6months">Last 6 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full" data-testid="performance-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="leads" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      name="Leads"
                    />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="conversions" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={2}
                      name="Conversions"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={2}
                      name="Revenue ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="traffic-sources-chart">
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full" data-testid="traffic-sources-pie">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversion Funnel and Campaign Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card data-testid="conversion-funnel">
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" data-testid="funnel-stages">
                {conversionFunnelData.map((stage, index) => (
                  <div key={stage.stage} className="space-y-2" data-testid={`funnel-stage-${index}`}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">{stage.stage}</span>
                      <div className="text-right">
                        <span className="font-semibold text-foreground" data-testid={`stage-count-${index}`}>
                          {stage.count.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground ml-2" data-testid={`stage-percentage-${index}`}>
                          ({stage.percentage}%)
                        </span>
                      </div>
                    </div>
                    <Progress 
                      value={stage.percentage} 
                      className="h-3"
                      data-testid={`stage-progress-${index}`}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card data-testid="campaign-performance-breakdown">
            <CardHeader>
              <CardTitle>Campaign Performance by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full" data-testid="campaign-performance-bar">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={[
                      { type: 'Email', campaigns: campaignsByType.email || 0, avgROI: 285, leads: totalLeads * 0.5 },
                      { type: 'Social', campaigns: campaignsByType.social || 0, avgROI: 192, leads: totalLeads * 0.3 },
                      { type: 'Content', campaigns: campaignsByType.content || 0, avgROI: 348, leads: totalLeads * 0.2 },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      yAxisId="left"
                      dataKey="leads" 
                      fill="hsl(var(--primary))" 
                      name="Leads"
                    />
                    <Bar 
                      yAxisId="right"
                      dataKey="avgROI" 
                      fill="hsl(var(--accent))" 
                      name="Avg ROI (%)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lead Quality Analysis */}
        <Card data-testid="lead-quality-analysis">
          <CardHeader>
            <CardTitle>Lead Quality Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center" data-testid="hot-leads-analysis">
                <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="text-2xl font-semibold text-destructive" data-testid="hot-leads-count">
                  {leadsByScore.hot}
                </h3>
                <p className="text-sm text-muted-foreground">Hot Leads (80-100)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(contacts?.length || 0) > 0 ? Math.round((leadsByScore.hot / (contacts?.length || 1)) * 100) : 0}% of total
                </p>
              </div>

              <div className="text-center" data-testid="warm-leads-analysis">
                <div className="w-16 h-16 bg-chart-3/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-chart-3" />
                </div>
                <h3 className="text-2xl font-semibold text-chart-3" data-testid="warm-leads-count">
                  {leadsByScore.warm}
                </h3>
                <p className="text-sm text-muted-foreground">Warm Leads (60-79)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(contacts?.length || 0) > 0 ? Math.round((leadsByScore.warm / (contacts?.length || 1)) * 100) : 0}% of total
                </p>
              </div>

              <div className="text-center" data-testid="cold-leads-analysis">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-primary" data-testid="cold-leads-count">
                  {leadsByScore.cold}
                </h3>
                <p className="text-sm text-muted-foreground">Cold Leads (0-59)</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {(contacts?.length || 0) > 0 ? Math.round((leadsByScore.cold / (contacts?.length || 1)) * 100) : 0}% of total
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
