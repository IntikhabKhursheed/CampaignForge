import { Button } from "@/components/ui/button";
import { Bell, Plus } from "lucide-react";

interface HeaderProps {
  title: string;
  description: string;
  showNewCampaignButton?: boolean;
  onNewCampaign?: () => void;
}

export default function Header({ 
  title, 
  description, 
  showNewCampaignButton = false, 
  onNewCampaign 
}: HeaderProps) {
  return (
    <header className="bg-card border-b border-border px-6 py-4" data-testid="header">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground" data-testid="page-title">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm" data-testid="page-description">
            {description}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {showNewCampaignButton && (
            <Button 
              onClick={onNewCampaign}
              data-testid="button-new-campaign"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Campaign
            </Button>
          )}
          <Button variant="ghost" size="icon" data-testid="button-notifications">
            <Bell className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
