
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
