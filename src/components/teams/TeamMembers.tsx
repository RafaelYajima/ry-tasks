
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTeam, TeamMember } from '@/contexts/TeamContext';
import { useAuth } from '@/contexts/AuthContext';
import { Trash2, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// Schema de validação
const emailSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const TeamMembers: React.FC = () => {
  const { user } = useAuth();
  const { currentTeam, teamMembers, addTeamMember, removeTeamMember } = useTeam();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: EmailFormValues) => {
    if (!currentTeam) return;
    
    setIsLoading(true);
    try {
      await addTeamMember(currentTeam.id, values.email);
      form.reset();
    } catch (error) {
      // Erro já tratado no TeamContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async (member: TeamMember) => {
    if (!currentTeam || !member.user_id) return;
    
    try {
      await removeTeamMember(currentTeam.id, member.user_id);
    } catch (error) {
      // Erro já tratado no TeamContext
    }
  };

  const getInitials = (email?: string) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };

  const isOwner = currentTeam?.owner_id === user?.id;

  return (
    <Card className="border shadow-sm animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl">Membros da Equipe</CardTitle>
        <CardDescription>
          Gerencie os membros da sua equipe
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {teamMembers.length > 0 ? (
          <ul className="space-y-3">
            {teamMembers.map((member) => (
              <li key={member.id} className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(member.user_email)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.user_email}</p>
                    <Badge variant={member.role === 'owner' ? "default" : "outline"} className="mt-1 text-xs">
                      {member.role === 'owner' ? 'Proprietário' : 'Membro'}
                    </Badge>
                  </div>
                </div>
                
                {isOwner && member.role !== 'owner' && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleRemoveMember(member)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-4 text-muted-foreground">
            Não há membros na equipe ainda.
          </p>
        )}
      </CardContent>
      
      {isOwner && (
        <CardFooter className="flex-col space-y-4">
          <div className="w-full border-t pt-4">
            <h4 className="text-sm font-medium mb-2">Adicionar novo membro</h4>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex space-x-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input placeholder="Email do membro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  size="icon"
                >
                  <UserPlus className="h-4 w-4" />
                </Button>
              </form>
            </Form>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default TeamMembers;
