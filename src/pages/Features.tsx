
import React from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardCheck, Users, Clock, BarChart, Bell, Share2 } from 'lucide-react';

const Features = () => {
  const featuresList = [
    {
      title: "Gestão de Tarefas",
      description: "Crie, atribua e acompanhe tarefas com facilidade. Categorize por prioridade e status para melhor organização.",
      icon: <ClipboardCheck className="h-10 w-10 text-brand-500" />,
    },
    {
      title: "Colaboração em Equipe",
      description: "Forme equipes e convide membros para colaborar em projetos. Compartilhe tarefas e atualizações em tempo real.",
      icon: <Users className="h-10 w-10 text-brand-500" />,
    },
    {
      title: "Acompanhamento de Prazos",
      description: "Defina datas de vencimento para tarefas e receba lembretes sobre prazos próximos.",
      icon: <Clock className="h-10 w-10 text-brand-500" />,
    },
    {
      title: "Métricas e Relatórios",
      description: "Visualize o progresso da equipe e o desempenho individual através de relatórios intuitivos.",
      icon: <BarChart className="h-10 w-10 text-brand-500" />,
    },
    {
      title: "Notificações Personalizadas",
      description: "Receba alertas sobre atualizações de tarefas, novos comentários e prazos importantes.",
      icon: <Bell className="h-10 w-10 text-brand-500" />,
    },
    {
      title: "Compartilhamento Flexível",
      description: "Compartilhe tarefas específicas ou projetos inteiros com membros internos ou colaboradores externos.",
      icon: <Share2 className="h-10 w-10 text-brand-500" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <section className="container px-4 md:px-6 mb-12">
          <div className="text-center max-w-[800px] mx-auto mb-12">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl animate-fade-in">
              Recursos do TaskFlow
            </h1>
            <p className="mt-4 text-xl text-muted-foreground animate-fade-in [animation-delay:200ms]">
              Descubra como nossa plataforma pode transformar a maneira como sua equipe colabora e gerencia tarefas.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresList.map((feature, index) => (
              <Card key={index} className="border shadow-sm animate-fade-in [animation-delay:300ms]">
                <CardHeader className="pb-2">
                  <div className="mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-foreground/70">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        <section className="bg-secondary/30 py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-[800px] mx-auto">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl animate-fade-in">
                Por que escolher o TaskFlow?
              </h2>
              <p className="mt-4 text-lg text-muted-foreground animate-fade-in [animation-delay:200ms]">
                Nossa plataforma foi projetada pensando na produtividade e na colaboração eficiente. Com uma interface intuitiva e recursos poderosos, o TaskFlow é a escolha ideal para equipes de todos os tamanhos.
              </p>
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="animate-fade-in [animation-delay:300ms]">
                  <h3 className="text-lg font-semibold mb-2">Fácil de usar</h3>
                  <p className="text-muted-foreground">Interface intuitiva que não requer treinamento extensivo para começar a usar.</p>
                </div>
                <div className="animate-fade-in [animation-delay:400ms]">
                  <h3 className="text-lg font-semibold mb-2">Colaborativo</h3>
                  <p className="text-muted-foreground">Promove a transparência e a comunicação eficaz entre os membros da equipe.</p>
                </div>
                <div className="animate-fade-in [animation-delay:500ms]">
                  <h3 className="text-lg font-semibold mb-2">Personalizável</h3>
                  <p className="text-muted-foreground">Adapte o fluxo de trabalho às necessidades específicas da sua equipe ou projeto.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 text-center md:flex-row md:justify-between">
          <div className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} TaskFlow. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Features;
