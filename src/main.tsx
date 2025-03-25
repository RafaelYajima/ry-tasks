
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootElement);

try {
  root.render(<App />);
} catch (error) {
  console.error("Error rendering the application:", error);
  
  // Render fallback UI in case of error
  root.render(
    <div style={{ 
      padding: '20px',
      fontFamily: 'sans-serif',
      maxWidth: '600px',
      margin: '40px auto',
      textAlign: 'center'
    }}>
      <h1>Algo deu errado</h1>
      <p>Não foi possível carregar a aplicação. Por favor, tente novamente mais tarde.</p>
      <button 
        onClick={() => window.location.reload()}
        style={{
          padding: '8px 16px',
          background: '#111',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Recarregar
      </button>
    </div>
  );
}
