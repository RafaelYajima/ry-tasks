import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useTeam } from './TeamContext';
import { toast } from "sonner";

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export type Task = {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
  due_date: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  team_id: string;
  assigned_to: string | null;
  created_by: string;
  updated_at: string;
  assignee_email?: string;
  creator_email?: string;
};

type TaskContextType = {
  tasks: Task[];
  isLoadingTasks: boolean;
  createTask: (task: Partial<Task>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  fetchTasks: () => Promise<void>;
  assignTask: (taskId: string, userId: string | null) => Promise<void>;
  filterTasks: (status?: TaskStatus | 'all', priority?: TaskPriority | 'all', assignedToMe?: boolean) => Task[];
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { currentTeam, teamMembers } = useTeam();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);

  useEffect(() => {
    if (user && currentTeam) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [user, currentTeam]);

  const fetchTasks = async () => {
    if (!user || !currentTeam) return;
    setIsLoadingTasks(true);
    
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:user_emails!assigned_to(email),
          creator:user_emails!created_by(email)
        `)
        .eq('team_id', currentTeam.id)
        .order('due_date', { ascending: true });
        
      if (error) throw error;

      const formattedTasks: Task[] = data.map((task: any) => ({
        ...task,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        assignee_email: task.assignee?.email || '',
        creator_email: task.creator?.email || ''
      }));
      
      setTasks(formattedTasks);
    } catch (error: any) {
      console.error('Erro ao buscar tarefas:', error);
      toast.error('Não foi possível carregar as tarefas');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const createTask = async (task: Partial<Task>) => {
    if (!user || !currentTeam) {
      toast.error('Você precisa estar em uma equipe para criar tarefas');
      return;
    }
    
    try {
      if (!task.title) {
        toast.error('O título da tarefa é obrigatório');
        return;
      }
      
      const newTask = {
        title: task.title,
        description: task.description || null,
        team_id: currentTeam.id,
        created_by: user.id,
        status: task.status || 'pending',
        priority: task.priority || 'medium',
        due_date: task.due_date || null,
        assigned_to: task.assigned_to || null
      };
      
      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select()
        .single();
        
      if (error) throw error;
      
      if (data) {
        const taskWithEmails: Task = {
          ...data,
          status: data.status as TaskStatus,
          priority: data.priority as TaskPriority,
          assignee_email: teamMembers.find(m => m.user_id === data.assigned_to)?.user_email || '',
          creator_email: user.email || ''
        };
        
        setTasks(prev => [...prev, taskWithEmails]);
      }
      
      toast.success('Tarefa criada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao criar tarefa:', error);
      toast.error('Erro ao criar tarefa');
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      setTasks(prev => 
        prev.map(task => 
          task.id === id 
            ? { 
                ...task, 
                ...updates, 
                assignee_email: updates.assigned_to 
                  ? teamMembers.find(m => m.user_id === updates.assigned_to)?.user_email || task.assignee_email
                  : task.assignee_email
              } 
            : task
        )
      );
      
      toast.success('Tarefa atualizada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar tarefa:', error);
      toast.error('Erro ao atualizar tarefa');
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setTasks(prev => prev.filter(task => task.id !== id));
      toast.success('Tarefa excluída com sucesso!');
    } catch (error: any) {
      console.error('Erro ao excluir tarefa:', error);
      toast.error('Erro ao excluir tarefa');
    }
  };

  const assignTask = async (taskId: string, userId: string | null) => {
    try {
      const updates = { assigned_to: userId };
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);
        
      if (error) throw error;
      
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { 
                ...task, 
                assigned_to: userId,
                assignee_email: userId 
                  ? teamMembers.find(m => m.user_id === userId)?.user_email || ''
                  : ''
              } 
            : task
        )
      );
      
      toast.success(userId ? 'Tarefa atribuída com sucesso!' : 'Tarefa desatribuída com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atribuir tarefa:', error);
      toast.error('Erro ao atribuir tarefa');
    }
  };

  const filterTasks = (status?: TaskStatus | 'all', priority?: TaskPriority | 'all', assignedToMe = false): Task[] => {
    return tasks.filter(task => {
      const statusMatch = !status || status === 'all' || task.status === status;
      const priorityMatch = !priority || priority === 'all' || task.priority === priority;
      const assignedMatch = !assignedToMe || task.assigned_to === user?.id;
      return statusMatch && priorityMatch && assignedMatch;
    });
  };

  const value = {
    tasks,
    isLoadingTasks,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
    assignTask,
    filterTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
