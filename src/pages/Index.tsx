
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import { ChevronRight, CheckCircle2, Users, Clock } from 'lucide-react';

const Index = () => {
  const features = [
    {
      title: 'Criar Equipes',
      description: 'Organize grupos de trabalho com facilidade para diferentes projetos ou departamentos.',
      icon: <Users className="h-8 w-8 text-brand-500" />,
    },
    {
      title: 'Compartilhar Tarefas',
      description: 'Atribua tarefas a qualquer membro da equipe e acompanhe o progresso coletivamente.',
      icon: <CheckCircle2 className="h-8 w-8 text-brand-500" />,
    },
    {
      title: 'Acompanhamento em Tempo Real',
      description: 'Visualize o status e o progresso das tarefas da sua equipe instantaneamente.',
      icon: <Clock className="h-8 w-8 text-brand-500" />,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-100 via-background to-background"></div>
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none animate-fade-in">
                  Simplifique o gerenciamento de tarefas em equipe
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl animate-fade-in [animation-delay:200ms]">
                  TaskFlow permite que você crie equipes, atribua tarefas e acompanhe o progresso de forma colaborativa. Trabalhe em conjunto de maneira mais eficiente.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in [animation-delay:400ms]">
                <Link to="/dashboard">
                  <Button size="lg" className="px-8">
                    Começar agora
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="px-8">
                    Saiba mais
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 md:py-24 bg-secondary/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Recursos</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Tudo que você precisa para colaborar
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Nosso sistema foi projetado para tornar o trabalho em equipe mais eficiente e transparente.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-12">
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center space-y-4 rounded-lg p-4 transition-all hover:bg-secondary animate-fade-in [animation-delay:600ms]">
                  <div className="rounded-full bg-secondary/50 p-4">
                    {feature.icon}
                  </div>
                  <div className="space-y-2 text-center">
                    <h3 className="font-bold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Pronto para melhorar a produtividade da sua equipe?
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Comece a usar o TaskFlow hoje mesmo e transforme a maneira como sua equipe colabora.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/dashboard">
                  <Button size="lg" className="px-8">
                    Comece gratuitamente
                  </Button>
                </Link>
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
          <div className="flex gap-4">
            <Link to="/about" className="text-sm text-muted-foreground hover:text-primary">
              Sobre
            </Link>
            <Link to="/features" className="text-sm text-muted-foreground hover:text-primary">
              Recursos
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
