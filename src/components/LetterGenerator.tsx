"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bot, FileText, Loader2, Clipboard, Sparkles, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { exampleLetters } from "@/lib/example-letters";
import { generateLetterResponse } from "@/app/actions";
import ChatRefinement from "@/components/ChatRefinement";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { LetterHistory, Message } from "@/lib/types";


const formSchema = z.object({
  letter: z.string().min(50, {
    message: "La carta debe tener al menos 50 caracteres.",
  }),
});

type LetterGeneratorProps = {
  selectedLetter: LetterHistory | null;
};

export default function LetterGenerator({ selectedLetter }: LetterGeneratorProps) {
  const [generatedResponse, setGeneratedResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [history, setHistory] = useLocalStorage<LetterHistory[]>("letterHistory", []);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  const { toast } = useToast();
  const responseRef = useRef<HTMLDivElement>(null);
  const currentLetterId = useRef<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      letter: "",
    },
  });

  useEffect(() => {
    if (selectedLetter) {
      form.setValue("letter", selectedLetter.originalLetter);
      setGeneratedResponse(selectedLetter.finalResponse);
      setChatMessages(selectedLetter.history);
      currentLetterId.current = selectedLetter.id;
    }
  }, [selectedLetter, form]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedResponse("");
    setChatMessages([]);
    currentLetterId.current = null;
    try {
      const result = await generateLetterResponse({
        letter: values.letter,
        exampleLetters: exampleLetters,
      });

      if (result.error) {
        throw new Error(result.error);
      }
      
      const response = result.response ?? "";
      setGeneratedResponse(response);

      // Create new history item but don't save yet
      const newHistoryItem: LetterHistory = {
        id: new Date().toISOString(),
        originalLetter: values.letter,
        finalResponse: response,
        history: [],
        createdAt: new Date(),
      };
      currentLetterId.current = newHistoryItem.id;
      // We will save it when user clicks "save" or generates a new letter
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al generar la respuesta",
        description:
          "Hubo un problema al comunicarse con la IA. Por favor, inténtelo de nuevo.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSaveHistory = () => {
    if (!currentLetterId.current || !generatedResponse) {
      toast({
        variant: "destructive",
        title: "Nada que guardar",
        description: "Primero genera una respuesta para poder guardarla.",
      });
      return;
    }

    const existingIndex = history.findIndex(item => item.id === currentLetterId.current);

    if (existingIndex !== -1) {
      // Update existing item
      const updatedHistory = [...history];
      updatedHistory[existingIndex] = {
        ...updatedHistory[existingIndex],
        finalResponse: generatedResponse,
        history: chatMessages,
      };
      setHistory(updatedHistory);
    } else {
      // Add new item
      const newHistoryItem: LetterHistory = {
        id: currentLetterId.current,
        originalLetter: form.getValues("letter"),
        finalResponse: generatedResponse,
        history: chatMessages,
        createdAt: new Date(),
      };
      setHistory([newHistoryItem, ...history]);
    }

    toast({
      title: "Guardado",
      description: "La carta y su conversación han sido guardadas en el historial.",
    });
  };

  const handleCopy = () => {
    if (responseRef.current) {
        const selection = window.getSelection();
        if (selection) {
            const range = document.createRange();
            range.selectNodeContents(responseRef.current);
            selection.removeAllRanges();
            selection.addRange(range);
            try {
                document.execCommand('copy');
                toast({
                    title: "Copiado",
                    description: "La respuesta con formato ha sido copiada.",
                });
            } catch (err) {
                console.error('Failed to copy text: ', err);
                toast({
                    variant: 'destructive',
                    title: "Error al copiar",
                    description: "No se pudo copiar el texto.",
                });
            }
            selection.removeAllRanges();
        }
    }
  };
  
  const formattedResponse = generatedResponse
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/<div style="text-align: right;">(.*?)<\/div>/g, '<div style="text-align: right;">$1</div>')
    .replace(/\n/g, "<br />");


  const handleResponseChange = (e: React.FormEvent<HTMLDivElement>) => {
    const newHtml = e.currentTarget.innerHTML;
    const newText = newHtml
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<strong>/gi, "**")
      .replace(/<\/strong>/gi, "**")
      .replace(/<div style="text-align: right;">/g, '\n<div style="text-align: right;">')
      .replace(/<\/div>/g, '</div>\n');

    setGeneratedResponse(newText);
  };
  
  const handleRefinement = (refinedResponse: string, newMessages: Message[]) => {
    setGeneratedResponse(refinedResponse);
    setChatMessages(newMessages);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="flex flex-col gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl flex items-center gap-2">
              <FileText className="text-accent" />
              Carta de Entrada
            </CardTitle>
            <CardDescription>
              Pegue aquí la carta que ha recibido. La IA generará una respuesta
              basada en el estilo de los documentos de ejemplo.
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardContent>
                <FormField
                  control={form.control}
                  name="letter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="sr-only">Carta recibida</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Escriba o pegue la carta aquí..."
                          className="min-h-[300px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generando...
                    </>
                  ) : (
                    "Generar Nueva Respuesta"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>

        {generatedResponse && (
          <ChatRefinement 
            originalResponse={generatedResponse}
            onRefinement={handleRefinement}
            onRefiningChange={setIsRefining}
            initialMessages={chatMessages}
          />
        )}
      </div>

      <Card className="sticky top-24">
        <CardHeader>
          <CardTitle className="font-headline text-xl flex items-center gap-2">
            <Bot className="text-accent" />
            Respuesta Generada
          </CardTitle>
          <CardDescription>
            Esta es la respuesta generada por la IA. Revísela, edítela si es necesario y cópiela.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] p-2 relative">
          {isLoading ? (
            <div className="space-y-3 p-4">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <br />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : generatedResponse ? (
            <>
              <div 
                ref={responseRef} 
                className="bg-white text-black p-6 rounded-md shadow-inner text-sm font-sans whitespace-pre-wrap min-h-[300px] focus:outline-none focus:ring-2 focus:ring-ring"
                contentEditable={true}
                dangerouslySetInnerHTML={{ __html: formattedResponse }} 
                suppressContentEditableWarning={true}
                onInput={handleResponseChange}
              />
              {isRefining && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-md">
                    <Sparkles className="w-10 h-10 text-primary sparkle" style={{ animationDelay: '0s' }} />
                    <Sparkles className="w-6 h-6 text-accent sparkle" style={{ animationDelay: '0.3s' }} />
                    <Sparkles className="w-8 h-8 text-primary/70 sparkle" style={{ animationDelay: '0.6s' }} />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
              <FileText size={48} className="mb-4" />
              <p>La respuesta generada aparecerá aquí.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <Button
            variant="outline"
            onClick={handleSaveHistory}
            disabled={!generatedResponse || isLoading || isRefining}
          >
            <Save className="mr-2 h-4 w-4" />
            Guardar
          </Button>
          <Button
            onClick={handleCopy}
            disabled={!generatedResponse || isLoading || isRefining}
          >
            <Clipboard className="mr-2 h-4 w-4" />
            Copiar Respuesta
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
