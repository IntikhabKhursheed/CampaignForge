import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import MetricsOverview from "@/components/dashboard/metrics-overview";
import PerformanceChart from "@/components/dashboard/performance-chart";
import RecentActivities from "@/components/dashboard/recent-activities";
import CampaignsTable from "@/components/dashboard/campaigns-table";
import TaskManagement from "@/components/dashboard/task-management";
import ContactInsights from "@/components/dashboard/contact-insights";
import CampaignWizard from "@/components/campaigns/campaign-wizard";

export default function Dashboard() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  const { data: metrics, isLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto" data-testid="dashboard-loading">
        <Header
          title="Dashboard"
          description="Welcome back! Here's an overview of your marketing campaigns."
          showNewCampaignButton={true}
          onNewCampaign={() => setIsWizardOpen(true)}
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

  return (
    <div className="flex-1 overflow-auto" data-testid="dashboard">
      <Header
        title="Dashboard"
        description="Welcome back! Here's an overview of your marketing campaigns."
        showNewCampaignButton={true}
        onNewCampaign={() => setIsWizardOpen(true)}
      />

      <div className="p-6 space-y-6">
        {/* Key Metrics Overview */}
        <MetricsOverview data={metrics} />

        {/* Performance Chart and Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PerformanceChart />
          <RecentActivities />
        </div>

        {/* Active Campaigns Table */}
        <CampaignsTable />

        {/* Task Management and Contact Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TaskManagement />
          <ContactInsights />
        </div>
      </div>

      {/* Campaign Creation Wizard */}
      <CampaignWizard open={isWizardOpen} onOpenChange={setIsWizardOpen} />
    </div>
  );
}
