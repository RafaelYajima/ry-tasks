
import { supabase } from '@/integrations/supabase/client';
import { Team, TeamMember } from '@/types/team';
import { toast } from "sonner";

export async function fetchTeams(): Promise<Team[]> {
  try {
    const { data, error } = await supabase
      .from('teams')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error('Erro ao buscar equipes:', error);
    toast.error('Não foi possível carregar suas equipes');
    return [];
  }
}

export async function createTeam(name: string, userId: string, description?: string): Promise<string | null> {
  try {
    const newTeam = {
      name,
      description: description || null,
      created_by: userId
    };
    
    const { data, error } = await supabase
      .from('teams')
      .insert(newTeam)
      .select()
      .single();
      
    if (error) throw error;
    
    if (data) {
      const memberData = {
        team_id: data.id,
        user_id: userId,
        role: 'owner' as const
      };
      
      const { error: memberError } = await supabase
        .from('team_members')
        .insert(memberData);
      
      if (memberError) {
        console.error('Erro ao adicionar membro à equipe:', memberError);
        toast.error('Equipe criada, mas houve um erro ao adicionar você como membro');
      }
      
      return data.id;
    }
    return null;
  } catch (error: any) {
    console.error('Erro ao criar equipe:', error);
    throw error;
  }
}

export async function updateTeam(id: string, name: string, description?: string): Promise<void> {
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
    
    toast.success('Equipe atualizada com sucesso!');
  } catch (error: any) {
    console.error('Erro ao atualizar equipe:', error);
    toast.error('Erro ao atualizar equipe');
    throw error;
  }
}

export async function deleteTeam(id: string, userId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('teams')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    
    toast.success('Equipe excluída com sucesso!');
  } catch (error: any) {
    console.error('Erro ao excluir equipe:', error);
    toast.error('Erro ao excluir equipe');
    throw error;
  }
}

export async function fetchTeamMembers(teamId: string): Promise<TeamMember[]> {
  try {
    const { data: members, error } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId);
      
    if (error) throw error;
    
    const memberData: TeamMember[] = [];
    
    for (const member of members) {
      try {
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
    
    return memberData;
  } catch (error: any) {
    console.error('Erro ao buscar membros da equipe:', error);
    toast.error('Erro ao carregar membros da equipe');
    return [];
  }
}

export async function addTeamMember(teamId: string, email: string): Promise<void> {
  try {
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
    
    toast.success('Membro adicionado com sucesso!');
  } catch (error: any) {
    console.error('Erro ao adicionar membro:', error);
    toast.error('Erro ao adicionar membro à equipe');
    throw error;
  }
}

export async function removeTeamMember(teamId: string, userId: string, currentUserId: string, isTeamOwner: boolean): Promise<void> {
  try {
    const isCurrentUser = userId === currentUserId;
    
    if (!isTeamOwner && !isCurrentUser) {
      toast.error('Apenas o proprietário pode remover membros');
      return;
    }
    
    const { data: memberData, error: memberError } = await supabase
      .from('team_members')
      .select('role')
      .eq('team_id', teamId)
      .eq('user_id', userId)
      .single();
    
    if (memberError) {
      console.error('Erro ao verificar função do membro:', memberError);
      toast.error('Erro ao verificar função do membro');
      return;
    }
    
    if (memberData.role === 'owner' && !isCurrentUser) {
      toast.error('Não é possível remover o proprietário da equipe');
      return;
    }
    
    const { error } = await supabase
      .from('team_members')
      .delete()
      .eq('team_id', teamId)
      .eq('user_id', userId);
      
    if (error) throw error;
    
    toast.success('Membro removido com sucesso!');
  } catch (error: any) {
    console.error('Erro ao remover membro:', error);
    toast.error('Erro ao remover membro da equipe');
    throw error;
  }
}
