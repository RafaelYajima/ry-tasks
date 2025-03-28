import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { Team, TeamMember } from '@/types/team';
import { 
  fetchTeams as fetchTeamsUtil,
  createTeam as createTeamUtil,
  updateTeam as updateTeamUtil,
  deleteTeam as deleteTeamUtil,
  fetchTeamMembers as fetchTeamMembersUtil,
  addTeamMember as addTeamMemberUtil,
  removeTeamMember as removeTeamMemberUtil
} from '@/utils/teamUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

type TeamContextType = {
  teams: Team[];
  currentTeam: Team | null;
  teamMembers: TeamMember[];
  isLoadingTeams: boolean;
  hasTeamsError: boolean;
  setCurrentTeam: (team: Team | null) => void;
  createTeam: (name: string, description?: string) => Promise<string | null>;
  updateTeam: (id: string, name: string, description?: string) => Promise<void>;
  deleteTeam: (id: string) => Promise<void>;
  fetchTeams: () => Promise<void>;
  addTeamMember: (teamId: string, email: string) => Promise<void>;
  removeTeamMember: (teamId: string, userId: string) => Promise<void>;
  fetchTeamMembers: (teamId: string) => Promise<void>;
};

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [hasTeamsError, setHasTeamsError] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTeams();
    } else {
      setTeams([]);
      setCurrentTeam(null);
    }
  }, [user]);

  useEffect(() => {
    if (currentTeam) {
      fetchTeamMembers(currentTeam.id);
    } else {
      setTeamMembers([]);
    }
  }, [currentTeam]);

  const fetchTeams = async () => {
    if (!user) return;
    
    setIsLoadingTeams(true);
    setHasTeamsError(false);
    
    try {
      const teamsData = await fetchTeamsUtil();
      setTeams(teamsData);
      
      if (teamsData.length > 0 && !currentTeam) {
        setCurrentTeam(teamsData[0]);
      }
    } catch (error) {
      console.error('Erro ao buscar equipes:', error);
      setHasTeamsError(true);
    } finally {
      setIsLoadingTeams(false);
    }
  };

  const createTeam = async (name: string, description?: string): Promise<string | null> => {
    if (!user) {
      throw new Error('Você precisa estar logado para criar uma equipe');
    }
    
    try {
      const teamId = await createTeamUtil(name, user.id, description);
      
      if (teamId) {
        await fetchTeams();
        return teamId;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao criar equipe:', error);
      return null;
    }
  };

  const updateTeam = async (id: string, name: string, description?: string) => {
    await updateTeamUtil(id, name, description);
    
    setTeams(prev => prev.map(team => 
      team.id === id ? { ...team, name, description: description || null } : team
    ));
    
    if (currentTeam?.id === id) {
      setCurrentTeam(prev => 
        prev ? { ...prev, name, description: description || null } : null
      );
    }
  };

  const deleteTeam = async (id: string) => {
    if (!user || !currentTeam) {
      throw new Error('Operação não permitida');
    }
    
    const isOwner = currentTeam.created_by === user.id;
    if (!isOwner) {
      throw new Error('Apenas o proprietário pode excluir a equipe');
    }
    
    await deleteTeamUtil(id, user.id);
    
    const updatedTeams = teams.filter(team => team.id !== id);
    setTeams(updatedTeams);
    
    if (currentTeam.id === id) {
      setCurrentTeam(updatedTeams.length > 0 ? updatedTeams[0] : null);
    }
  };

  const fetchTeamMembers = async (teamId: string) => {
    const membersData = await fetchTeamMembersUtil(teamId);
    setTeamMembers(membersData);
  };

  const addTeamMember = async (teamId: string, email: string) => {
    await addTeamMemberUtil(teamId, email);
    
    if (currentTeam?.id === teamId) {
      await fetchTeamMembers(teamId);
    }
  };

  const removeTeamMember = async (teamId: string, userId: string) => {
    if (!user || !currentTeam) {
      throw new Error('Operação não permitida');
    }
    
    const isOwner = currentTeam.created_by === user.id;
    await removeTeamMemberUtil(teamId, userId, user.id, isOwner);
    
    setTeamMembers(prev => prev.filter(member => member.user_id !== userId));
  };

  const value = {
    teams,
    currentTeam,
    teamMembers,
    isLoadingTeams,
    hasTeamsError,
    setCurrentTeam,
    createTeam,
    updateTeam,
    deleteTeam,
    fetchTeams,
    addTeamMember,
    removeTeamMember,
    fetchTeamMembers,
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};

export { type Team, type TeamMember };
