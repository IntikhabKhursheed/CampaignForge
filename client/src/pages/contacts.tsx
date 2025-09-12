import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Search, Filter, User, Mail, Phone, Building, Plus, Edit, Trash2, Star } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertContactSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import type { Contact } from "@shared/schema";

const contactFormSchema = insertContactSchema.extend({
  leadScore: z.number().min(0).max(100).optional(),
  tags: z.array(z.string()).optional(),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const getLeadScoreColor = (score: number) => {
  if (score >= 80) return "text-destructive";
  if (score >= 60) return "text-chart-3";
  return "text-primary";
};

const getLeadScoreBadge = (score: number) => {
  if (score >= 80) return { label: "Hot Lead", color: "bg-destructive/10 text-destructive" };
  if (score >= 60) return { label: "Warm Lead", color: "bg-chart-3/10 text-chart-3" };
  return { label: "Cold Lead", color: "bg-primary/10 text-primary" };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "converted":
      return "bg-accent/10 text-accent";
    case "qualified":
      return "bg-primary/10 text-primary";
    case "contacted":
      return "bg-chart-3/10 text-chart-3";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Contacts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterScore, setFilterScore] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const { toast } = useToast();

  const { data: contacts, isLoading } = useQuery<Contact[]>({
    queryKey: ["/api/contacts"],
  });

  const { data: metrics } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      position: "",
      leadScore: 0,
      status: "new",
      source: "",
      tags: [],
      notes: "",
      userId: "demo-user-id",
    },
  });

  const createContactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return apiRequest("POST", "/api/contacts", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Contact Created",
        description: "Contact has been added successfully.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create contact. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateContactMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContactFormData> }) => {
      return apiRequest("PUT", `/api/contacts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Contact Updated",
        description: "Contact has been updated successfully.",
      });
      setIsDialogOpen(false);
      setEditingContact(null);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update contact. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/contacts/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      toast({
        title: "Contact Deleted",
        description: "Contact has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete contact. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredContacts = contacts?.filter(contact => {
    const matchesSearch = 
      contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || contact.status === filterStatus;
    
    let matchesScore = true;
    if (filterScore === "hot") matchesScore = contact.leadScore >= 80;
    else if (filterScore === "warm") matchesScore = contact.leadScore >= 60 && contact.leadScore < 80;
    else if (filterScore === "cold") matchesScore = contact.leadScore < 60;
    
    return matchesSearch && matchesStatus && matchesScore;
  }) || [];

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    form.reset({
      ...contact,
      tags: contact.tags || [],
    });
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingContact(null);
    form.reset();
    setIsDialogOpen(true);
  };

  const onSubmit = (data: ContactFormData) => {
    if (editingContact) {
      updateContactMutation.mutate({ id: editingContact.id, data });
    } else {
      createContactMutation.mutate(data);
    }
  };

  const leadScores = metrics?.leadScores || { hot: 0, warm: 0, cold: 0 };
  const total = leadScores.hot + leadScores.warm + leadScores.cold;

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto" data-testid="contacts-loading">
        <Header
          title="Contacts"
          description="Manage your leads and customer relationships."
        />
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto" data-testid="contacts">
      <Header
        title="Contacts"
        description="Manage your leads and customer relationships."
      />

      <div className="p-6 space-y-6">
        {/* Lead Score Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Hot Leads</p>
                  <p className="text-2xl font-semibold text-destructive mt-2" data-testid="hot-leads-count">
                    {leadScores.hot}
                  </p>
                </div>
                <div className="w-8 h-8 bg-destructive/10 rounded-md flex items-center justify-center">
                  <Star className="h-4 w-4 text-destructive" />
                </div>
              </div>
              <Progress 
                value={total > 0 ? (leadScores.hot / total) * 100 : 0} 
                className="mt-4 h-2"
                data-testid="hot-leads-progress"
              />
              <p className="text-xs text-muted-foreground mt-2">Score 80-100</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Warm Leads</p>
                  <p className="text-2xl font-semibold text-chart-3 mt-2" data-testid="warm-leads-count">
                    {leadScores.warm}
                  </p>
                </div>
                <div className="w-8 h-8 bg-chart-3/10 rounded-md flex items-center justify-center">
                  <User className="h-4 w-4 text-chart-3" />
                </div>
              </div>
              <Progress 
                value={total > 0 ? (leadScores.warm / total) * 100 : 0} 
                className="mt-4 h-2"
                data-testid="warm-leads-progress"
              />
              <p className="text-xs text-muted-foreground mt-2">Score 60-79</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Cold Leads</p>
                  <p className="text-2xl font-semibold text-primary mt-2" data-testid="cold-leads-count">
                    {leadScores.cold}
                  </p>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
              </div>
              <Progress 
                value={total > 0 ? (leadScores.cold / total) * 100 : 0} 
                className="mt-4 h-2"
                data-testid="cold-leads-progress"
              />
              <p className="text-xs text-muted-foreground mt-2">Score 0-59</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-contacts"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus} data-testid="select-filter-status">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterScore} onValueChange={setFilterScore} data-testid="select-filter-score">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Lead Score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="hot">Hot (80-100)</SelectItem>
                  <SelectItem value="warm">Warm (60-79)</SelectItem>
                  <SelectItem value="cold">Cold (0-59)</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleCreate} data-testid="button-add-contact">
                <Plus className="mr-2 h-4 w-4" />
                Add Contact
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contacts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => {
            const scoreBadge = getLeadScoreBadge(contact.leadScore);
            return (
              <Card key={contact.id} className="hover:shadow-md transition-shadow" data-testid={`contact-card-${contact.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground" data-testid={`contact-name-${contact.id}`}>
                          {contact.firstName} {contact.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground" data-testid={`contact-company-${contact.id}`}>
                          {contact.position}{contact.company ? ` at ${contact.company}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-lg font-bold ${getLeadScoreColor(contact.leadScore)}`} data-testid={`contact-score-${contact.id}`}>
                        {contact.leadScore}
                      </span>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Badge className={scoreBadge.color} data-testid={`contact-score-badge-${contact.id}`}>
                        {scoreBadge.label}
                      </Badge>
                      <Badge className={getStatusColor(contact.status)} data-testid={`contact-status-${contact.id}`}>
                        {contact.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <Mail className="h-3 w-3 mr-2" />
                        <span className="truncate" data-testid={`contact-email-${contact.id}`}>
                          {contact.email}
                        </span>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center text-muted-foreground">
                          <Phone className="h-3 w-3 mr-2" />
                          <span data-testid={`contact-phone-${contact.id}`}>
                            {contact.phone}
                          </span>
                        </div>
                      )}
                      {contact.company && (
                        <div className="flex items-center text-muted-foreground">
                          <Building className="h-3 w-3 mr-2" />
                          <span data-testid={`contact-company-detail-${contact.id}`}>
                            {contact.company}
                          </span>
                        </div>
                      )}
                    </div>

                    {contact.tags && contact.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1" data-testid={`contact-tags-${contact.id}`}>
                        {contact.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {contact.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{contact.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2 border-t">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEdit(contact)}
                        data-testid={`button-edit-${contact.id}`}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => deleteContactMutation.mutate(contact.id)}
                        data-testid={`button-delete-${contact.id}`}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredContacts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                {contacts?.length === 0 ? (
                  <div data-testid="no-contacts">
                    <h3 className="text-lg font-medium text-foreground mb-2">No contacts yet</h3>
                    <p>Start building your customer database by adding your first contact.</p>
                  </div>
                ) : (
                  <div data-testid="no-filtered-contacts">
                    <h3 className="text-lg font-medium text-foreground mb-2">No contacts match your filters</h3>
                    <p>Try adjusting your search criteria or filters.</p>
                  </div>
                )}
              </div>
              {contacts?.length === 0 && (
                <Button onClick={handleCreate} data-testid="button-create-first-contact">
                  Add Your First Contact
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Contact Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl" data-testid="contact-dialog">
          <DialogHeader>
            <DialogTitle>
              {editingContact ? "Edit Contact" : "Add New Contact"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John" {...field} data-testid="input-first-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Doe" {...field} data-testid="input-last-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@company.com" {...field} data-testid="input-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1-555-0123" {...field} data-testid="input-phone" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="leadScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Lead Score (0-100)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          max="100" 
                          placeholder="75" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          data-testid="input-lead-score"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Inc." {...field} data-testid="input-company" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="CEO" {...field} data-testid="input-position" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-contact-status">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="qualified">Qualified</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source</FormLabel>
                      <FormControl>
                        <Input placeholder="Campaign ID or source" {...field} data-testid="input-source" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional notes about this contact..." 
                        {...field} 
                        data-testid="textarea-notes"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createContactMutation.isPending || updateContactMutation.isPending}
                  data-testid="button-save-contact"
                >
                  {createContactMutation.isPending || updateContactMutation.isPending 
                    ? "Saving..." 
                    : editingContact ? "Update Contact" : "Create Contact"
                  }
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
