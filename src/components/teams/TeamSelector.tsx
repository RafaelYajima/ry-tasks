
import React, { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from 'lucide-react';
import { useTeam } from '@/contexts/TeamContext';
import CreateTeamDialog from './CreateTeamDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TeamSelector: React.FC = () => {
  const { teams, currentTeam, setCurrentTeam, hasTeamsError, fetchTeams } = useTeam();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleTeamChange = (teamId: string) => {
    const selected = teams.find(team => team.id === teamId);
    if (selected) {
      setCurrentTeam(selected);
    }
  };

  const handleRefresh = () => {
    fetchTeams();
  };

  return (
    <div className="space-y-2">
      {hasTeamsError && (
        <Alert variant="destructive" className="mb-2">
          <AlertDescription className="flex items-center justify-between">
            <span>Erro ao carregar equipes</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              className="ml-2"
            >
              <RefreshCw className="h-4 w-4 mr-1" /> Tentar novamente
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-[200px]">
          <Select 
            value={currentTeam?.id} 
            onValueChange={handleTeamChange}
            disabled={teams.length === 0}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={teams.length === 0 ? "Nenhuma equipe encontrada" : "Selecione uma equipe"} />
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
    </div>
  );
};

export default TeamSelector;
