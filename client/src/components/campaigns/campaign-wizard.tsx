import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Share2, FileText, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCampaignSchema } from "@shared/models";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const campaignFormSchema = insertCampaignSchema.extend({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type CampaignFormData = z.infer<typeof campaignFormSchema>;

interface CampaignWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const campaignTypes = [
  {
    type: "email",
    title: "Email Campaign",
    description: "Create targeted email campaigns with automation and tracking",
    icon: Mail,
  },
  {
    type: "social",
    title: "Social Media",
    description: "Multi-platform social media campaigns with scheduled posts",
    icon: Share2,
  },
  {
    type: "content",
    title: "Content Marketing",
    description: "Blog posts, whitepapers, and educational content series",
    icon: FileText,
  },
];

export default function CampaignWizard({ open, onOpenChange }: CampaignWizardProps) {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<CampaignFormData>({
    resolver: zodResolver(campaignFormSchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
      targetAudience: "",
      budget: 0,
      userId: "demo-user-id",
    },
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (data: CampaignFormData) => {
      const payload = {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      };
      return apiRequest("POST", "/api/campaigns", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Campaign Created",
        description: "Your campaign has been created successfully.",
      });
      onOpenChange(false);
      resetWizard();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    },
  });

  const resetWizard = () => {
    setStep(1);
    setSelectedType("");
    form.reset();
  };

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    form.setValue("type", type);
  };

  const handleNext = () => {
    if (step === 1 && selectedType) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const onSubmit = (data: CampaignFormData) => {
    createCampaignMutation.mutate(data);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetWizard();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-auto" data-testid="campaign-wizard">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Create New Campaign</DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose} data-testid="button-close-wizard">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                1
              </div>
              <span className={`ml-2 text-sm ${step >= 1 ? "font-medium text-primary" : "text-muted-foreground"}`}>
                Campaign Type
              </span>
            </div>
            <div className="flex-1 h-px bg-border"></div>
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                2
              </div>
              <span className={`ml-2 text-sm ${step >= 2 ? "font-medium text-primary" : "text-muted-foreground"}`}>
                Configuration
              </span>
            </div>
          </div>
        </DialogHeader>

        {step === 1 && (
          <div className="p-6">
            <h3 className="text-lg font-medium text-foreground mb-6">Choose Campaign Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {campaignTypes.map((campaign) => (
                <div
                  key={campaign.type}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedType === campaign.type
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary hover:bg-primary/5"
                  }`}
                  onClick={() => handleTypeSelect(campaign.type)}
                  data-testid={`campaign-type-${campaign.type}`}
                >
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <campaign.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground mb-2">{campaign.title}</h4>
                  <p className="text-sm text-muted-foreground">{campaign.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter campaign name" {...field} data-testid="input-campaign-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your campaign goals and strategy" 
                          {...field} 
                          value={field.value || ""}
                          data-testid="textarea-campaign-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Audience</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Enterprise customers, SMB market" {...field} value={field.value || ""} data-testid="input-target-audience" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="5000" 
                            {...field} 
                            value={field.value || ""}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            data-testid="input-budget"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Initial Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-status">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            data-testid="input-start-date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                            data-testid="input-end-date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </div>
        )}

        <div className="p-6 border-t border-border flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={step === 1 ? handleClose : handleBack}
            data-testid="button-back"
          >
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          
          {step === 1 ? (
            <Button 
              onClick={handleNext} 
              disabled={!selectedType}
              data-testid="button-next"
            >
              Next Step
            </Button>
          ) : (
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              disabled={createCampaignMutation.isPending}
              data-testid="button-create-campaign"
            >
              {createCampaignMutation.isPending ? "Creating..." : "Create Campaign"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
