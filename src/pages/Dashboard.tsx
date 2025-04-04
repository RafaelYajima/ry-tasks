
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTeam } from '@/contexts/TeamContext';
import Header from '@/components/layout/Header';
import TaskList from '@/components/tasks/TaskList';
import TeamSelector from '@/components/teams/TeamSelector';
import TeamMembers from '@/components/teams/TeamMembers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from 'lucide-react';
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarInset
} from "@/components/ui/sidebar";

const Dashboard = () => {
  const { user, isLoading } = useAuth();

  // Se estiver carregando, mostra uma tela de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, redireciona para a página inicial
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <div className="flex flex-1 pt-16">
          <TeamSidebar />
          
          <SidebarInset>
            <main className="flex-1 p-4 md:p-6 animate-fade-in">
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
            </main>
          </SidebarInset>
          
          <SidebarTrigger 
            className="fixed bottom-6 right-6 z-50 shadow-md bg-background rounded-full p-2 border border-border hover:bg-secondary transition-all" 
          />
        </div>
      </div>
    </SidebarProvider>
  );
};

// Componente para a barra lateral de equipes no estilo Discord
const TeamSidebar = () => {
  const { teams, currentTeam, setCurrentTeam } = useTeam();

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarContent className="py-4">
        <div className="flex flex-col items-center gap-4">
          {teams.map((team) => (
            <TeamIcon 
              key={team.id} 
              team={team} 
              isActive={currentTeam?.id === team.id}
              onClick={() => setCurrentTeam(team)} 
            />
          ))}
          
          <div className="my-2 w-10 h-[1px] bg-border mx-auto"></div>
          
          <button 
            className="flex items-center justify-center w-12 h-12 rounded-full bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200 shadow-sm hover:shadow"
            aria-label="Criar nova equipe"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

// Componente para o ícone de uma equipe
const TeamIcon = ({ team, isActive, onClick }) => {
  // Função para gerar cores com base no nome da equipe
  const generateColor = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 65%, 55%)`;
  };

  // Pegue as iniciais do nome da equipe (até 2 caracteres)
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <button
      className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200 shadow-sm ${
        isActive 
          ? 'ring-2 ring-primary scale-110' 
          : 'hover:bg-secondary hover:scale-105'
      }`}
      style={{ backgroundColor: generateColor(team.name) }}
      onClick={onClick}
    >
      {isActive && (
        <div className="absolute -left-1 w-1.5 h-8 bg-white dark:bg-zinc-200 rounded-r-full" />
      )}
      <span className="text-sm font-semibold text-white">{getInitials(team.name)}</span>
    </button>
  );
};

export default Dashboard;
