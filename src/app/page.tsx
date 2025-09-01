"use client";

import LetterGenerator from '@/components/LetterGenerator';
import { Bot, MessageSquareText } from 'lucide-react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import HistorySidebar from '@/components/HistorySidebar';
import { useState } from 'react';
import { LetterHistory } from '@/lib/types';


export default function Home() {
  const [selectedLetter, setSelectedLetter] = useState<LetterHistory | null>(null);

  const handleSelectLetter = (letter: LetterHistory) => {
    setSelectedLetter(letter);
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-3">
              <Bot className="h-8 w-8 text-primary" />
              <h1 className="font-headline text-2xl font-bold tracking-tight text-primary group-data-[collapsible=icon]:hidden">
                Respuesta Inteligente
              </h1>
            </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
            <HistorySidebar onSelectLetter={handleSelectLetter}/>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden"/>
                <MessageSquareText className="h-6 w-6"/>
                <h2 className="font-headline text-xl font-bold">Generador</h2>
            </div>
          </div>
        </header>
        <main className="container mx-auto p-4 md:p-8">
          <LetterGenerator key={selectedLetter?.id} selectedLetter={selectedLetter} />
        </main>
      </SidebarInset>
    </div>
  );
}
