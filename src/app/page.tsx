import LetterGenerator from '@/components/LetterGenerator';
import { Bot } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Bot className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-2xl font-bold tracking-tight text-primary">
              Respuesta Inteligente
            </h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4 md:p-8">
        <LetterGenerator />
      </main>
    </div>
  );
}
