
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import TaskList from '@/components/tasks/TaskList';
import TeamSelector from '@/components/teams/TeamSelector';
import TeamMembers from '@/components/teams/TeamMembers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  const { user, isLoading } = useAuth();

  // Se estiver carregando, mostra uma tela de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para a página inicial
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tighter">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Gerencie suas equipes e tarefas
              </p>
            </div>
            <TeamSelector />
          </div>
          
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full md:w-[400px] grid-cols-2">
              <TabsTrigger value="tasks">Tarefas</TabsTrigger>
              <TabsTrigger value="team">Equipe</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tasks" className="mt-6">
              <TaskList />
            </TabsContent>
            
            <TabsContent value="team" className="mt-6">
              <TeamMembers />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
