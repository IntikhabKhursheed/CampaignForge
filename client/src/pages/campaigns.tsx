import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import CampaignWizard from "@/components/campaigns/campaign-wizard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Eye, Edit, Trash2 } from "lucide-react";
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
    case "draft":
      return "bg-secondary/10 text-secondary-foreground";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Campaigns() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: campaigns, isLoading } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const filteredCampaigns = campaigns?.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || campaign.type === filterType;
    const matchesStatus = filterStatus === "all" || campaign.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto" data-testid="campaigns-loading">
        <Header
          title="Campaigns"
          description="Manage your marketing campaigns and track their performance."
          showNewCampaignButton={true}
          onNewCampaign={() => setIsWizardOpen(true)}
        />
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto" data-testid="campaigns">
      <Header
        title="Campaigns"
        description="Manage your marketing campaigns and track their performance."
        showNewCampaignButton={true}
        onNewCampaign={() => setIsWizardOpen(true)}
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-campaigns"
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType} data-testid="select-filter-type">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus} data-testid="select-filter-status">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow" data-testid={`campaign-card-${campaign.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg" data-testid={`campaign-name-${campaign.id}`}>
                      {campaign.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1" data-testid={`campaign-description-${campaign.id}`}>
                      {campaign.description || "No description"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getCampaignTypeColor(campaign.type)} data-testid={`campaign-type-${campaign.id}`}>
                      {campaign.type}
                    </Badge>
                    <Badge className={getStatusColor(campaign.status)} data-testid={`campaign-status-${campaign.id}`}>
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-semibold text-foreground" data-testid={`campaign-leads-${campaign.id}`}>
                        {campaign.metrics?.leads?.toLocaleString() || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Leads</p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-foreground" data-testid={`campaign-conversions-${campaign.id}`}>
                        {campaign.metrics?.conversions || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Conversions</p>
                    </div>
                    <div>
                      <p className="text-2xl font-semibold text-accent" data-testid={`campaign-roi-${campaign.id}`}>
                        {campaign.metrics?.roi || 0}%
                      </p>
                      <p className="text-xs text-muted-foreground">ROI</p>
                    </div>
                  </div>

                  {/* Campaign Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Target:</span>
                      <span className="text-foreground" data-testid={`campaign-target-${campaign.id}`}>
                        {campaign.targetAudience || "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Budget:</span>
                      <span className="text-foreground" data-testid={`campaign-budget-${campaign.id}`}>
                        ${campaign.budget?.toLocaleString() || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created:</span>
                      <span className="text-foreground" data-testid={`campaign-created-${campaign.id}`}>
                        {new Date(campaign.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1" data-testid={`button-view-${campaign.id}`}>
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" data-testid={`button-edit-${campaign.id}`}>
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" data-testid={`button-delete-${campaign.id}`}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCampaigns.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                {campaigns?.length === 0 ? (
                  <div data-testid="no-campaigns">
                    <h3 className="text-lg font-medium text-foreground mb-2">No campaigns yet</h3>
                    <p>Create your first campaign to get started with marketing automation.</p>
                  </div>
                ) : (
                  <div data-testid="no-filtered-campaigns">
                    <h3 className="text-lg font-medium text-foreground mb-2">No campaigns match your filters</h3>
                    <p>Try adjusting your search criteria or filters.</p>
                  </div>
                )}
              </div>
              {campaigns?.length === 0 && (
                <Button onClick={() => setIsWizardOpen(true)} data-testid="button-create-first-campaign">
                  Create Your First Campaign
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <CampaignWizard open={isWizardOpen} onOpenChange={setIsWizardOpen} />
    </div>
  );
}
