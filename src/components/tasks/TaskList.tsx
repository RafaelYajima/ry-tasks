
import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { Button } from '@/components/ui/button';
import { useTask, TaskStatus, TaskPriority } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import CreateTaskDialog from './CreateTaskDialog';
import { PlusCircle } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const TaskList: React.FC = () => {
  const { tasks, isLoadingTasks, filterTasks } = useTask();
  const { user } = useAuth();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<TaskStatus | undefined>(undefined);
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | undefined>(undefined);
  const [assignedToMeFilter, setAssignedToMeFilter] = useState(false);

  const filteredTasks = filterTasks(statusFilter, priorityFilter, assignedToMeFilter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Tarefas</h2>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 p-2 bg-secondary/30 rounded-md">
        <div className="flex-1">
          <Select 
            value={statusFilter} 
            onValueChange={(value) => setStatusFilter(value as TaskStatus || undefined)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="in_progress">Em Progresso</SelectItem>
              <SelectItem value="completed">Concluída</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <Select 
            value={priorityFilter} 
            onValueChange={(value) => setPriorityFilter(value as TaskPriority || undefined)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Filtrar por prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as prioridades</SelectItem>
              <SelectItem value="low">Baixa</SelectItem>
              <SelectItem value="medium">Média</SelectItem>
              <SelectItem value="high">Alta</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2 px-2">
          <Checkbox 
            id="assignedToMe" 
            checked={assignedToMeFilter}
            onCheckedChange={(checked) => setAssignedToMeFilter(checked as boolean)}
          />
          <Label htmlFor="assignedToMe" className="text-sm cursor-pointer">
            Minhas tarefas
          </Label>
        </div>
      </div>
      
      {isLoadingTasks ? (
        <div className="min-h-[200px] grid place-content-center">
          <p className="text-muted-foreground">Carregando tarefas...</p>
        </div>
      ) : filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      ) : (
        <div className="min-h-[200px] grid place-content-center bg-secondary/30 rounded-md">
          <p className="text-muted-foreground">Nenhuma tarefa encontrada.</p>
        </div>
      )}
      
      <CreateTaskDialog 
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
};

export default TaskList;
