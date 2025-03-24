
import React, { useState } from 'react';
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

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultTab = "login" 
}) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">(defaultTab);

  const handleSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden animate-scale-in">
        <DialogHeader className="pt-6 px-6 pb-2">
          <DialogTitle className="text-2xl font-semibold">
            {activeTab === "login" ? "Entrar" : "Criar conta"}
          </DialogTitle>
          <DialogDescription>
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
            <TabsTrigger value="login" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Login</TabsTrigger>
            <TabsTrigger value="register" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">Registro</TabsTrigger>
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
