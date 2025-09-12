import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Contact } from "@shared/schema";

export default function ContactInsights() {
  const { data: contacts, isLoading } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  const { data: metrics } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  if (isLoading) {
    return (
      <Card data-testid="contact-insights">
        <CardHeader>
          <CardTitle>Contact Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hotLeads = contacts?.filter(c => (c.leadScore || 0) >= 80).slice(0, 2) || [];
  const leadScores = (metrics as any)?.leadScores || { hot: 0, warm: 0, cold: 0 };
  const total = leadScores.hot + leadScores.warm + leadScores.cold;

  return (
    <Card data-testid="contact-insights">
      <CardHeader>
        <CardTitle>Contact Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-foreground">Lead Score Distribution</p>
              <Button variant="ghost" size="sm" data-testid="button-view-details">
                View Details
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Hot Leads (80-100)</span>
                  <span className="font-medium text-foreground" data-testid="hot-leads-count">
                    {leadScores.hot}
                  </span>
                </div>
                <Progress 
                  value={total > 0 ? (leadScores.hot / total) * 100 : 0} 
                  className="h-2"
                  data-testid="hot-leads-progress"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Warm Leads (60-79)</span>
                  <span className="font-medium text-foreground" data-testid="warm-leads-count">
                    {leadScores.warm}
                  </span>
                </div>
                <Progress 
                  value={total > 0 ? (leadScores.warm / total) * 100 : 0} 
                  className="h-2"
                  data-testid="warm-leads-progress"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Cold Leads (0-59)</span>
                  <span className="font-medium text-foreground" data-testid="cold-leads-count">
                    {leadScores.cold}
                  </span>
                </div>
                <Progress 
                  value={total > 0 ? (leadScores.cold / total) * 100 : 0} 
                  className="h-2"
                  data-testid="cold-leads-progress"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h4 className="text-sm font-medium text-foreground mb-3">Recent High-Value Leads</h4>
            <div className="space-y-3">
              {hotLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between" data-testid={`high-value-lead-${lead.id}`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground" data-testid={`lead-name-${lead.id}`}>
                        {lead.firstName} {lead.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground" data-testid={`lead-company-${lead.id}`}>
                        {lead.position}{lead.company ? `, ${lead.company}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-destructive" data-testid={`lead-score-${lead.id}`}>
                      {lead.leadScore}
                    </span>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                </div>
              ))}
              
              {hotLeads.length === 0 && (
                <div className="text-center py-4 text-muted-foreground" data-testid="no-high-value-leads">
                  <p className="text-sm">No high-value leads yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
