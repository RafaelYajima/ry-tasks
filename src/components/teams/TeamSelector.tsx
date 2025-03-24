
import React, { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle } from 'lucide-react';
import { useTeam, Team } from '@/contexts/TeamContext';
import CreateTeamDialog from './CreateTeamDialog';

const TeamSelector: React.FC = () => {
  const { teams, currentTeam, setCurrentTeam } = useTeam();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleTeamChange = (teamId: string) => {
    const selected = teams.find(team => team.id === teamId);
    if (selected) {
      setCurrentTeam(selected);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-[200px]">
        <Select 
          value={currentTeam?.id} 
          onValueChange={handleTeamChange}
          disabled={teams.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecione uma equipe" />
          </SelectTrigger>
          <SelectContent>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsCreateDialogOpen(true)}
        className="flex-shrink-0"
      >
        <PlusCircle className="h-4 w-4" />
      </Button>
      
      <CreateTeamDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
};

export default TeamSelector;
