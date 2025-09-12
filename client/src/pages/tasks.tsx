import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Search, Filter, Plus, Edit, Trash2, Clock, CheckSquare, 
  Calendar as CalendarIcon, Users, AlertCircle, Zap
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Task } from "@shared/schema";

const taskFormSchema = insertTaskSchema.extend({
  dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskFormSchema>;

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-destructive/10 text-destructive";
    case "medium":
      return "bg-chart-3/10 text-chart-3";
    case "low":
      return "bg-primary/10 text-primary";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-accent/10 text-accent";
    case "in_progress":
      return "bg-chart-3/10 text-chart-3";
    case "todo":
      return "bg-primary/10 text-primary";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case "campaign":
      return "bg-primary/10 text-primary";
    case "crm":
      return "bg-accent/10 text-accent";
    case "content":
      return "bg-destructive/10 text-destructive";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function Tasks() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { toast } = useToast();

  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      assignedTo: "",
      category: "",
      campaignId: "",
      userId: "demo-user-id",
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: async (data: TaskFormData) => {
      const payload = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      };
      return apiRequest("POST", "/api/tasks", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task Created",
        description: "Task has been created successfully.",
      });
      setIsDialogOpen(false);
      form.reset();
      setSelectedDate(undefined);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TaskFormData> }) => {
      const payload = {
        ...data,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      };
      return apiRequest("PUT", `/api/tasks/${id}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task Updated",
        description: "Task has been updated successfully.",
      });
      setIsDialogOpen(false);
      setEditingTask(null);
      form.reset();
      setSelectedDate(undefined);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "Task Deleted",
        description: "Task has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleTaskStatus = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      return apiRequest("PUT", `/api/tasks/${id}`, { 
        status: completed ? "completed" : "todo" 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const filteredTasks = tasks?.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    const matchesPriority = filterPriority === "all" || task.priority === filterPriority;
    const matchesCategory = filterCategory === "all" || task.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  }) || [];

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    form.reset({
      ...task,
      dueDate: task.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd") : "",
    });
    if (task.dueDate) {
      setSelectedDate(new Date(task.dueDate));
    }
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingTask(null);
    form.reset();
    setSelectedDate(undefined);
    setIsDialogOpen(true);
  };

  const onSubmit = (data: TaskFormData) => {
    if (editingTask) {
      updateTaskMutation.mutate({ id: editingTask.id, data });
    } else {
      createTaskMutation.mutate(data);
    }
  };

  const handleTaskComplete = (taskId: string, completed: boolean) => {
    toggleTaskStatus.mutate({ id: taskId, completed });
  };

  // Calculate task statistics
  const taskStats = tasks?.reduce((acc, task) => {
    acc.total++;
    if (task.status === "completed") acc.completed++;
    else if (task.status === "in_progress") acc.inProgress++;
    else acc.todo++;

    if (task.priority === "high") acc.high++;
    else if (task.priority === "medium") acc.medium++;
    else acc.low++;

    // Check overdue tasks
    if (task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed") {
      acc.overdue++;
    }

    return acc;
  }, { 
    total: 0, completed: 0, inProgress: 0, todo: 0, 
    high: 0, medium: 0, low: 0, overdue: 0 
  }) || { 
    total: 0, completed: 0, inProgress: 0, todo: 0, 
    high: 0, medium: 0, low: 0, overdue: 0 
  };

  const completionRate = taskStats.total > 0 ? (taskStats.completed / taskStats.total) * 100 : 0;

  if (isLoading) {
    return (
      <div className="flex-1 overflow-auto" data-testid="tasks-loading">
        <Header
          title="Tasks"
          description="Manage campaign activities, deadlines, and team assignments."
        />
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto" data-testid="tasks">
      <Header
        title="Tasks"
        description="Manage campaign activities, deadlines, and team assignments."
      />

      <div className="p-6 space-y-6">
        {/* Task Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card data-testid="task-stats-total">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                  <p className="text-2xl font-semibold text-foreground mt-2" data-testid="total-tasks-count">
                    {taskStats.total}
                  </p>
                </div>
                <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                  <CheckSquare className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Completion Rate</span>
                  <span className="font-medium" data-testid="completion-rate">
                    {completionRate.toFixed(1)}%
                  </span>
                </div>
                <Progress value={completionRate} className="h-2" data-testid="completion-progress" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="task-stats-in-progress">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-semibold text-chart-3 mt-2" data-testid="in-progress-count">
                    {taskStats.inProgress}
                  </p>
                </div>
                <div className="w-8 h-8 bg-chart-3/10 rounded-md flex items-center justify-center">
                  <Clock className="h-4 w-4 text-chart-3" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-muted-foreground">Active work items</span>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="task-stats-high-priority">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">High Priority</p>
                  <p className="text-2xl font-semibold text-destructive mt-2" data-testid="high-priority-count">
                    {taskStats.high}
                  </p>
                </div>
                <div className="w-8 h-8 bg-destructive/10 rounded-md flex items-center justify-center">
                  <Zap className="h-4 w-4 text-destructive" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-muted-foreground">Urgent tasks</span>
              </div>
            </CardContent>
          </Card>

          <Card data-testid="task-stats-overdue">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                  <p className="text-2xl font-semibold text-destructive mt-2" data-testid="overdue-count">
                    {taskStats.overdue}
                  </p>
                </div>
                <div className="w-8 h-8 bg-destructive/10 rounded-md flex items-center justify-center">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <span className="text-muted-foreground">Need attention</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-tasks"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus} data-testid="select-filter-status">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority} data-testid="select-filter-priority">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterCategory} onValueChange={setFilterCategory} data-testid="select-filter-category">
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="campaign">Campaign</SelectItem>
                  <SelectItem value="crm">CRM</SelectItem>
                  <SelectItem value="content">Content</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleCreate} data-testid="button-add-task">
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <Card data-testid="tasks-list">
          <CardHeader>
            <CardTitle>Tasks ({filteredTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTasks.map((task) => {
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed";
                return (
                  <div 
                    key={task.id} 
                    className={cn(
                      "flex items-start space-x-3 p-4 border rounded-lg transition-colors",
                      task.status === "completed" ? "bg-muted/30" : "bg-card",
                      isOverdue ? "border-destructive/50" : "border-border"
                    )}
                    data-testid={`task-${task.id}`}
                  >
                    <Checkbox
                      checked={task.status === "completed"}
                      onCheckedChange={(checked) => handleTaskComplete(task.id, Boolean(checked))}
                      className="mt-1"
                      data-testid={`task-checkbox-${task.id}`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 
                            className={cn(
                              "font-medium",
                              task.status === "completed" 
                                ? "line-through text-muted-foreground" 
                                : "text-foreground"
                            )}
                            data-testid={`task-title-${task.id}`}
                          >
                            {task.title}
                          </h3>
                          {task.description && (
                            <p 
                              className="text-sm text-muted-foreground mt-1"
                              data-testid={`task-description-${task.id}`}
                            >
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEdit(task)}
                            data-testid={`button-edit-task-${task.id}`}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteTaskMutation.mutate(task.id)}
                            data-testid={`button-delete-task-${task.id}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <Badge 
                            className={getPriorityColor(task.priority)}
                            data-testid={`task-priority-${task.id}`}
                          >
                            {task.priority}
                          </Badge>
                          <Badge 
                            className={getStatusColor(task.status)}
                            data-testid={`task-status-${task.id}`}
                          >
                            {task.status.replace("_", " ")}
                          </Badge>
                          {task.category && (
                            <Badge 
                              className={getCategoryColor(task.category)}
                              data-testid={`task-category-${task.id}`}
                            >
                              {task.category}
                            </Badge>
                          )}
                          {isOverdue && (
                            <Badge className="bg-destructive/10 text-destructive">
                              Overdue
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          {task.assignedTo && (
                            <div className="flex items-center" data-testid={`task-assigned-${task.id}`}>
                              <Users className="h-3 w-3 mr-1" />
                              <span>{task.assignedTo}</span>
                            </div>
                          )}
                          {task.dueDate && (
                            <div 
                              className={cn(
                                "flex items-center",
                                isOverdue ? "text-destructive" : ""
                              )}
                              data-testid={`task-due-date-${task.id}`}
                            >
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              <span>{format(new Date(task.dueDate), "MMM d, yyyy")}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredTasks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground" data-testid="no-tasks">
                  {tasks?.length === 0 ? (
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">No tasks yet</h3>
                      <p>Create your first task to start managing your campaign activities.</p>
                      <Button onClick={handleCreate} className="mt-4" data-testid="button-create-first-task">
                        Create Your First Task
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">No tasks match your filters</h3>
                      <p>Try adjusting your search criteria or filters.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Task Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl" data-testid="task-dialog">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Create New Task"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter task title..." {...field} data-testid="input-task-title" />
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
                        placeholder="Describe the task details..." 
                        {...field} 
                        value={field.value || ""}
                        data-testid="textarea-task-description"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-task-priority">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-task-status">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="todo">To Do</SelectItem>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
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
                  name="assignedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assigned To</FormLabel>
                      <FormControl>
                        <Input placeholder="Team member name" {...field} value={field.value || ""} data-testid="input-assigned-to" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value || undefined} data-testid="select-task-category">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="campaign">Campaign</SelectItem>
                          <SelectItem value="crm">CRM</SelectItem>
                          <SelectItem value="content">Content</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            data-testid="button-due-date"
                          >
                            {field.value ? (
                              format(new Date(field.value), "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            field.onChange(date ? format(date, "yyyy-MM-dd") : "");
                          }}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0, 0, 0, 0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
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
                  disabled={createTaskMutation.isPending || updateTaskMutation.isPending}
                  data-testid="button-save-task"
                >
                  {createTaskMutation.isPending || updateTaskMutation.isPending 
                    ? "Saving..." 
                    : editingTask ? "Update Task" : "Create Task"
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
