
import React from 'react';
import { format } from 'date-fns';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Task, TaskStatus, useTask } from '@/contexts/TaskContext';
import { useTeam } from '@/contexts/TeamContext';
import { useAuth } from '@/contexts/AuthContext';
import { MoreHorizontal, Calendar, User, Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { user } = useAuth();
  const { teamMembers } = useTeam();
  const { updateTask, deleteTask, assignTask } = useTask();

  // Status color mapping
  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200'
  };

  // Priority color mapping
  const priorityColors = {
    low: 'bg-gray-100 text-gray-800 border-gray-200',
    medium: 'bg-orange-100 text-orange-800 border-orange-200',
    high: 'bg-red-100 text-red-800 border-red-200'
  };

  // Textos para exibição
  const statusText = {
    pending: 'Pendente',
    in_progress: 'Em Progresso',
    completed: 'Concluída'
  };

  const priorityText = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta'
  };

  const handleStatusChange = async (status: TaskStatus) => {
    await updateTask(task.id, { status });
  };

  const handleDelete = async () => {
    await deleteTask(task.id);
  };

  const handleAssignToMe = async () => {
    await assignTask(task.id, user?.id || null);
  };

  const handleUnassign = async () => {
    await assignTask(task.id, null);
  };

  const getInitials = (email?: string) => {
    if (!email) return 'T';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <Card className="border hover:shadow-md transition-shadow animate-fade-in">
      <CardHeader className="pb-2 pt-4 px-4 flex flex-row justify-between items-start">
        <div className="space-y-1">
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge className={statusColors[task.status]}>
              {statusText[task.status]}
            </Badge>
            <Badge className={priorityColors[task.priority]}>
              {priorityText[task.priority]}
            </Badge>
          </div>
          <h3 className="font-medium text-base">{task.title}</h3>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
              Marcar como Pendente
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('in_progress')}>
              Marcar como Em Progresso
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange('completed')}>
              Marcar como Concluída
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir Tarefa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="px-4 py-2">
        {task.description && (
          <p className="text-sm text-muted-foreground mb-2">
            {task.description}
          </p>
        )}
      </CardContent>
      
      <CardFooter className="px-4 pt-0 pb-4 flex flex-col items-start">
        <div className="w-full flex justify-between items-center mt-2">
          {task.due_date ? (
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(task.due_date), 'dd/MM/yyyy')}
            </div>
          ) : (
            <div />
          )}
          
          {task.assigned_to ? (
            <div className="flex items-center gap-1">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {getInitials(task.assignee_email)}
                </AvatarFallback>
              </Avatar>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    {task.assignee_email ? task.assignee_email.split('@')[0] : 'Usuário'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {task.assigned_to === user?.id ? (
                    <DropdownMenuItem onClick={handleUnassign}>
                      Desatribuir de mim
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={handleAssignToMe}>
                      Atribuir para mim
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 px-2 text-xs flex items-center"
              onClick={handleAssignToMe}
            >
              <User className="h-3 w-3 mr-1" />
              Atribuir
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
