
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft, RotateCcw } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    console.error(
      "404 Error: Tentativa de acesso à rota inexistente:",
      location.pathname
    );

    // Timer para mostrar por quanto tempo o usuário está na página de erro
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [location.pathname]);

  const goBack = () => navigate(-1);
  const goHome = () => navigate('/');
  const reloadPage = () => window.location.reload();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md px-4 py-8 rounded-lg bg-card shadow-lg border">
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="h-12 w-12 text-destructive" />
          <div>
            <h1 className="text-4xl font-bold mb-2">404</h1>
            <p className="text-xl text-muted-foreground mb-2">Página não encontrada</p>
            <p className="text-sm text-muted-foreground mb-6">
              A página "{location.pathname}" não existe ou está temporariamente indisponível.
            </p>
          </div>
          
          <div className="space-y-3 w-full">
            <Button variant="outline" className="w-full" onClick={goBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            
            <Button className="w-full" onClick={goHome}>
              <Home className="mr-2 h-4 w-4" />
              Página inicial
            </Button>
            
            {timeElapsed > 5 && (
              <Button variant="secondary" className="w-full" onClick={reloadPage}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Recarregar página
              </Button>
            )}
          </div>
          
          {timeElapsed > 10 && (
            <div className="mt-4 p-3 bg-muted rounded-md text-sm text-left">
              <p className="font-medium mb-1">Sugestões de resolução:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Verifique se a URL está correta</li>
                <li>Confirme se você está logado (caso necessário)</li>
                <li>Tente limpar o cache do navegador</li>
                <li>Se o problema persistir, entre em contato com o suporte</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
