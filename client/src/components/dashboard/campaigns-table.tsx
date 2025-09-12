import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Eye, Edit } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Campaign } from "@shared/schema";

const getCampaignTypeColor = (type: string) => {
  switch (type) {
    case "email":
      return "bg-primary/10 text-primary";
    case "social":
      return "bg-chart-3/10 text-chart-3";
    case "content":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-accent/10 text-accent";
    case "paused":
      return "bg-muted text-muted-foreground";
    case "completed":
      return "bg-primary/10 text-primary";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function CampaignsTable() {
  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  if (isLoading) {
    return (
      <Card data-testid="campaigns-table">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Active Campaigns</h3>
          </div>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="campaigns-table">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Active Campaigns</h3>
          <div className="flex items-center space-x-3">
            <Input 
              type="text" 
              placeholder="Search campaigns..." 
              className="min-w-64"
              data-testid="input-search-campaigns"
            />
            <Button variant="ghost" size="icon" data-testid="button-filter-campaigns">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">
                  Campaign
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">
                  Type
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">
                  Leads
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">
                  Conversion
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">
                  ROI
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider p-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {campaigns?.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-muted/30" data-testid={`campaign-row-${campaign.id}`}>
                  <td className="p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground" data-testid={`campaign-name-${campaign.id}`}>
                        {campaign.name}
                      </p>
                      <p className="text-xs text-muted-foreground" data-testid={`campaign-created-${campaign.id}`}>
                        Created {new Date(campaign.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge className={getCampaignTypeColor(campaign.type)} data-testid={`campaign-type-${campaign.id}`}>
                      {campaign.type}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge className={getStatusColor(campaign.status)} data-testid={`campaign-status-${campaign.id}`}>
                      {campaign.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-foreground" data-testid={`campaign-leads-${campaign.id}`}>
                    {campaign.metrics?.leads?.toLocaleString() || 0}
                  </td>
                  <td className="p-4 text-sm text-foreground" data-testid={`campaign-conversion-${campaign.id}`}>
                    {campaign.metrics?.conversions 
                      ? `${((campaign.metrics.conversions / (campaign.metrics.leads || 1)) * 100).toFixed(1)}%`
                      : "0.0%"
                    }
                  </td>
                  <td className="p-4 text-sm font-medium text-accent" data-testid={`campaign-roi-${campaign.id}`}>
                    +{campaign.metrics?.roi || 0}%
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" data-testid={`button-view-${campaign.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" data-testid={`button-edit-${campaign.id}`}>
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
