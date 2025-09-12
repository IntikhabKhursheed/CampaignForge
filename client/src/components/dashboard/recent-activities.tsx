import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, UserPlus, Share2, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Activity } from "@shared/schema";

const activityIcons = {
  campaign_launched: Mail,
  leads_generated: UserPlus,
  social_campaign: Share2,
  crm_sync: RefreshCw,
  campaign_created: Mail,
};

export default function RecentActivities() {
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activities"],
  });

  if (isLoading) {
    return (
      <Card data-testid="recent-activities">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3 animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="recent-activities">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities?.map((activity) => {
            const IconComponent = activityIcons[activity.type as keyof typeof activityIcons] || Mail;
            return (
              <div key={activity.id} className="flex items-start space-x-3" data-testid={`activity-${activity.id}`}>
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <IconComponent className="text-primary h-3 w-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground" data-testid={`activity-title-${activity.id}`}>
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1" data-testid={`activity-description-${activity.id}`}>
                    {activity.description} • {new Date(activity.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <Button variant="ghost" className="w-full mt-4 text-sm" data-testid="button-view-all-activities">
          View all activities
        </Button>
      </CardContent>
    </Card>
  );
}
