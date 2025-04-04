
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
  redirectTo?: string;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultTab = "login",
  redirectTo = "/dashboard"
}) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Update active tab when defaultTab changes
  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  // Se o usuário já estiver autenticado, fecha o modal
  useEffect(() => {
    if (user) {
      onClose();
    }
  }, [user, onClose]);

  const handleSuccess = () => {
    onClose();
    if (redirectTo) {
      navigate(redirectTo);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden shadow-lg animate-scale-in">
        <DialogHeader className="pt-6 px-6 pb-2 bg-gradient-to-r from-brand-600/5 to-brand-400/5">
          <DialogTitle className="text-2xl font-semibold text-center">
            {activeTab === "login" ? "Bem-vindo de volta!" : "Crie sua conta"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {activeTab === "login" 
              ? "Faça login para gerenciar suas tarefas e equipes."
              : "Crie uma conta para começar a organizar suas tarefas."
            }
          </DialogDescription>
        </DialogHeader>
        
        <Tabs 
          value={activeTab} 
          onValueChange={(v) => setActiveTab(v as "login" | "register")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full rounded-none border-b">
            <TabsTrigger 
              value="login" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Login
            </TabsTrigger>
            <TabsTrigger 
              value="register" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Registro
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="m-0 p-6">
            <LoginForm onSuccess={handleSuccess} />
          </TabsContent>
          
          <TabsContent value="register" className="m-0 p-6">
            <RegisterForm onSuccess={handleSuccess} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
