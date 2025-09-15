import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { Task } from "@shared/models";

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-destructive/10 text-destructive";
    case "medium":
      return "bg-chart-3/10 text-chart-3";
    case "low":
      return "bg-muted text-muted-foreground";
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
      return "bg-chart-3/10 text-chart-3";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export default function TaskManagement() {
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Task> }) => {
      return apiRequest("PUT", `/api/tasks/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  const handleTaskComplete = (taskId: string, completed: boolean) => {
    updateTaskMutation.mutate({
      id: taskId,
      data: { status: completed ? "completed" : "todo" }
    });
  };

  if (isLoading) {
    return (
      <Card data-testid="task-management">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Upcoming Tasks</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-3 border border-border rounded-lg animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const upcomingTasks = tasks?.filter(task => task.status !== "completed").slice(0, 5) || [];

  return (
    <Card data-testid="task-management">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Upcoming Tasks</CardTitle>
          <Button variant="ghost" size="sm" data-testid="button-add-task">
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingTasks.map((task) => (
            <div 
              key={task.id} 
              className="flex items-start space-x-3 p-3 border border-border rounded-lg"
              data-testid={`task-${task.id}`}
            >
              <Checkbox
                checked={task.status === "completed"}
                onCheckedChange={(checked) => handleTaskComplete(task.id, Boolean(checked))}
                className="mt-1"
                data-testid={`task-checkbox-${task.id}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground" data-testid={`task-title-${task.id}`}>
                  {task.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1" data-testid={`task-details-${task.id}`}>
                  {task.dueDate 
                    ? `Due ${new Date(task.dueDate).toLocaleDateString()}`
                    : "No due date"
                  } • {task.assignedTo ? `Assigned to ${task.assignedTo}` : "Unassigned"}
                </p>
                <div className="flex items-center mt-2 space-x-2">
                  <Badge className={getPriorityColor(task.priority)} data-testid={`task-priority-${task.id}`}>
                    {task.priority} Priority
                  </Badge>
                  {task.category && (
                    <Badge className={getCategoryColor(task.category)} data-testid={`task-category-${task.id}`}>
                      {task.category}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {upcomingTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground" data-testid="no-tasks">
              <p>No upcoming tasks</p>
              <Button variant="ghost" size="sm" className="mt-2" data-testid="button-create-first-task">
                Create your first task
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
