
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from "sonner";

export type Team = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  created_by: string;
};

export type TeamMember = {
  id: string;
  team_id: string;
  user_id: string;
  role: 'owner' | 'member';
  user_email?: string;
};

type TeamContextType = {
  teams: Team[];
  currentTeam: Team | null;
  teamMembers: TeamMember[];
  isLoadingTeams: boolean;
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
    
    try {
      const { data: ownedTeams, error: ownedError } = await supabase
        .from('teams')
        .select('*')
        .eq('created_by', user.id);

      if (ownedError) throw ownedError;

      const { data: memberTeams, error: memberError } = await supabase
        .from('team_members')
        .select('team_id')
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      let memberTeamsDetails: Team[] = [];
      if (memberTeams && memberTeams.length > 0) {
        const teamIds = memberTeams.map(tm => tm.team_id);
        const { data, error } = await supabase
          .from('teams')
          .select('*')
          .in('id', teamIds);
          
        if (error) throw error;
        memberTeamsDetails = data || [];
      }

      const allTeams = [...(ownedTeams || []), ...memberTeamsDetails];
      const uniqueTeams = Array.from(new Map(allTeams.map(team => [team.id, team])).values());
      
      setTeams(uniqueTeams);
      
      if (uniqueTeams.length > 0 && !currentTeam) {
        setCurrentTeam(uniqueTeams[0]);
      }
    } catch (error: any) {
      console.error('Erro ao buscar equipes:', error);
      toast.error('Não foi possível carregar suas equipes');
    } finally {
      setIsLoadingTeams(false);
    }
  };

  const createTeam = async (name: string, description?: string): Promise<string | null> => {
    if (!user) {
      toast.error('Você precisa estar logado para criar uma equipe');
      return null;
    }
    
    try {
      const newTeam = {
        name,
        description: description || null,
        created_by: user.id
      };
      
      const { data, error } = await supabase
        .from('teams')
        .insert(newTeam)
        .select()
        .single();
        
      if (error) throw error;
      
      if (data) {
        await supabase.from('team_members').insert({
          team_id: data.id,
          user_id: user.id,
          role: 'owner'
        });
        
        const teamWithTypedData: Team = data;
        setTeams(prev => [...prev, teamWithTypedData]);
        setCurrentTeam(teamWithTypedData);
        toast.success('Equipe criada com sucesso!');
        return data.id;
      }
      return null;
    } catch (error: any) {
      console.error('Erro ao criar equipe:', error);
      toast.error('Erro ao criar equipe');
      return null;
    }
  };

  const updateTeam = async (id: string, name: string, description?: string) => {
    try {
      const updates = {
        name,
        description: description || null,
        updated_at: new Date()
      };
      
      const { error } = await supabase
        .from('teams')
        .update(updates)
        .eq('id', id);
        
      if (error) throw error;
      
      setTeams(prev => prev.map(team => team.id === id ? { ...team, ...updates } : team));
      
      if (currentTeam?.id === id) {
        setCurrentTeam(prev => prev ? { ...prev, ...updates } : null);
      }
      
      toast.success('Equipe atualizada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar equipe:', error);
      toast.error('Erro ao atualizar equipe');
    }
  };

  const deleteTeam = async (id: string) => {
    try {
      // Check if user is the team owner (created_by matches user.id)
      if (!user || !currentTeam || currentTeam.created_by !== user.id) {
        toast.error('Apenas o proprietário pode excluir a equipe');
        return;
      }
      
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setTeams(prev => prev.filter(team => team.id !== id));
      
      if (currentTeam?.id === id) {
        const remainingTeams = teams.filter(team => team.id !== id);
        setCurrentTeam(remainingTeams.length > 0 ? remainingTeams[0] : null);
      }
      
      toast.success('Equipe excluída com sucesso!');
    } catch (error: any) {
      console.error('Erro ao excluir equipe:', error);
      toast.error('Erro ao excluir equipe');
    }
  };

  const fetchTeamMembers = async (teamId: string) => {
    try {
      const { data: members, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId);
        
      if (error) throw error;
      
      const memberData: TeamMember[] = [];
      
      for (const member of members) {
        try {
          // Get user email from the user_emails view
          const { data: userData, error: userError } = await supabase
            .from('user_emails')
            .select('email')
            .eq('id', member.user_id)
            .single();
            
          if (userError) {
            console.error('Erro ao buscar informações do usuário:', userError);
            memberData.push({
              ...member,
              role: member.role as 'owner' | 'member',
              user_email: ''
            });
          } else {
            memberData.push({
              ...member,
              role: member.role as 'owner' | 'member',
              user_email: userData?.email || ''
            });
          }
        } catch (userFetchError) {
          console.error('Erro ao buscar usuário:', userFetchError);
          memberData.push({
            ...member,
            role: member.role as 'owner' | 'member',
            user_email: ''
          });
        }
      }
      
      setTeamMembers(memberData);
    } catch (error: any) {
      console.error('Erro ao buscar membros da equipe:', error);
      toast.error('Erro ao carregar membros da equipe');
    }
  };

  const addTeamMember = async (teamId: string, email: string) => {
    try {
      // First, we need to find the user ID by email using the user_emails view
      const { data: userData, error: userError } = await supabase
        .from('user_emails')
        .select('id')
        .eq('email', email)
        .single();
      
      if (userError || !userData) {
        toast.error('Usuário não encontrado');
        return;
      }
      
      const userId = userData.id;
      
      const { data: existingMember, error: checkError } = await supabase
        .from('team_members')
        .select('id')
        .eq('team_id', teamId)
        .eq('user_id', userId)
        .single();
        
      if (existingMember) {
        toast.error('Usuário já é membro desta equipe');
        return;
      }
      
      const { error } = await supabase
        .from('team_members')
        .insert({
          team_id: teamId,
          user_id: userId,
          role: 'member'
        });
        
      if (error) throw error;
      
      await fetchTeamMembers(teamId);
      toast.success('Membro adicionado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao adicionar membro:', error);
      toast.error('Erro ao adicionar membro à equipe');
    }
  };

  const removeTeamMember = async (teamId: string, userId: string) => {
    try {
      // Check if current user is the team owner or is removing themself
      const isTeamOwner = user?.id === currentTeam?.created_by;
      const isSelfRemoval = user?.id === userId;
      
      if (!isTeamOwner && !isSelfRemoval) {
        toast.error('Apenas o proprietário pode remover membros');
        return;
      }
      
      const memberToRemove = teamMembers.find(m => m.user_id === userId);
      if (memberToRemove?.role === 'owner') {
        toast.error('Não é possível remover o proprietário da equipe');
        return;
      }
      
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      setTeamMembers(prev => prev.filter(member => member.user_id !== userId));
      toast.success('Membro removido com sucesso!');
    } catch (error: any) {
      console.error('Erro ao remover membro:', error);
      toast.error('Erro ao remover membro da equipe');
    }
  };

  const value = {
    teams,
    currentTeam,
    teamMembers,
    isLoadingTeams,
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
