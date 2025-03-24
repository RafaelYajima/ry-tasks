
import React from 'react';
import Header from '@/components/layout/Header';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container px-4 md:px-6 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6 animate-fade-in">
            Sobre o TaskFlow
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-muted-foreground mb-8 animate-fade-in [animation-delay:200ms]">
              O TaskFlow nasceu da necessidade de simplificar a colaboração e o gerenciamento de tarefas em equipe. Nossa missão é proporcionar uma ferramenta intuitiva que permita que equipes trabalhem juntas de forma mais eficiente.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4 animate-fade-in [animation-delay:300ms]">Nossa Missão</h2>
            <p className="animate-fade-in [animation-delay:400ms]">
              Acreditamos que o trabalho em equipe é fundamental para o sucesso de qualquer projeto. Por isso, desenvolvemos uma plataforma que facilita a colaboração, a comunicação e o acompanhamento de tarefas de forma transparente e eficaz.
            </p>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4 animate-fade-in [animation-delay:500ms]">Recursos Principais</h2>
            <ul className="list-disc pl-6 space-y-2 animate-fade-in [animation-delay:600ms]">
              <li>Criação e gerenciamento de equipes</li>
              <li>Atribuição e acompanhamento de tarefas</li>
              <li>Priorização e categorização de atividades</li>
              <li>Interface intuitiva e responsiva</li>
              <li>Colaboração em tempo real</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mt-10 mb-4 animate-fade-in [animation-delay:700ms]">Nossa Visão</h2>
            <p className="animate-fade-in [animation-delay:800ms]">
              Buscamos ser a ferramenta preferida para equipes que valorizam a produtividade, a transparência e a colaboração eficaz. Continuamos evoluindo e melhorando nossa plataforma com base no feedback dos usuários e nas tendências do mercado.
            </p>
            
            <div className="my-12 p-6 bg-secondary rounded-lg border animate-fade-in [animation-delay:900ms]">
              <h3 className="text-xl font-semibold mb-2">Experimente o TaskFlow hoje</h3>
              <p className="mb-0">
                Junte-se a milhares de equipes que já estão otimizando seu fluxo de trabalho com nossa plataforma. Crie sua conta gratuitamente e comece a transformar a maneira como sua equipe colabora.
              </p>
            </div>
          </div>
        </div>
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

export default About;
