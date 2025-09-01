"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bot, FileText, Loader2, Clipboard, Sparkles, PencilRuler } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
import { generateLetterResponse, generateNewLetter } from "@/app/actions";
import ChatRefinement from "@/components/ChatRefinement";


const responseFormSchema = z.object({
  letter: z.string().min(50, {
    message: "La carta debe tener al menos 50 caracteres.",
  }),
});

const newLetterFormSchema = z.object({
  prompt: z.string().min(10, {
    message: "La instrucción debe tener al menos 10 caracteres.",
  }),
});


export default function LetterGenerator() {
  const [generatedResponse, setGeneratedResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [activeTab, setActiveTab] = useState("response");
  
  const { toast } = useToast();
  const responseRef = useRef<HTMLDivElement>(null);

  const responseForm = useForm<z.infer<typeof responseFormSchema>>({
    resolver: zodResolver(responseFormSchema),
    defaultValues: {
      letter: "",
    },
  });

  const newLetterForm = useForm<z.infer<typeof newLetterFormSchema>>({
    resolver: zodResolver(newLetterFormSchema),
    defaultValues: {
      prompt: "",
    },
  });

  async function onResponseSubmit(values: z.infer<typeof responseFormSchema>) {
    setIsLoading(true);
    setGeneratedResponse("");
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

  async function onNewLetterSubmit(values: z.infer<typeof newLetterFormSchema>) {
    setIsLoading(true);
    setGeneratedResponse("");
    try {
      const result = await generateNewLetter({
        prompt: values.prompt,
      });

      if (result.error) {
        throw new Error(result.error);
      }
      
      const response = result.response ?? "";
      setGeneratedResponse(response);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al generar la carta",
        description:
          "Hubo un problema al comunicarse con la IA. Por favor, inténtelo de nuevo.",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }


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
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n/g, "<br />");

  useEffect(() => {
    // Only update innerHTML when the AI response changes, not during user input.
    if (responseRef.current && responseRef.current.innerHTML !== formattedResponse) {
      responseRef.current.innerHTML = formattedResponse;
    }
  }, [formattedResponse]);


  const handleResponseChange = (e: React.FormEvent<HTMLDivElement>) => {
    const html = e.currentTarget.innerHTML;
    // Convert the HTML back to our markdown-like format for the AI
    const newText = html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<strong>/gi, "**")
      .replace(/<\/strong>/gi, "**")
      .replace(/<div style="text-align: right;">/g, '<div style="text-align: right;">')
      .replace(/<\/div>/g, '</div>')
      .replace(/<a href="(.*?)"[^>]*>(.*?)<\/a>/g, '$2 ($1)')
      .replace(/&nbsp;/g, " ")
      .replace(/<[^>]*>/g, ""); // Basic cleanup of other html tags
    
    // We update the state, but we don't cause a re-render that overwrites innerHTML
    // because of the check in useEffect.
    setGeneratedResponse(newText);
  };
  
  const handleRefinement = (refinedResponse: string) => {
    setGeneratedResponse(refinedResponse);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <div className="flex flex-col gap-8">
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <CardHeader>
                <CardTitle className="font-headline text-xl">
                    Asistente de correos
                </CardTitle>
                <TabsList className="grid w-full grid-cols-2 mt-2">
                    <TabsTrigger value="response" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                        <FileText className="mr-2" />
                        Responder a Carta
                    </TabsTrigger>
                    <TabsTrigger value="new" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                        <PencilRuler className="mr-2" />
                        Crear Nueva Carta
                    </TabsTrigger>
                </TabsList>
            </CardHeader>
            <TabsContent value="response">
                <Form {...responseForm}>
                    <form onSubmit={responseForm.handleSubmit(onResponseSubmit)}>
                        <CardContent>
                            <CardDescription className="mb-4">
                                Pegue aquí la carta que ha recibido. La IA generará una respuesta
                                basada en el estilo de los documentos de ejemplo.
                            </CardDescription>
                            <FormField
                                control={responseForm.control}
                                name="letter"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="sr-only">Carta recibida</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Escriba o pegue la carta aquí..."
                                                className="min-h-[250px] resize-y"
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
                                    "Generar Respuesta"
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </TabsContent>
            <TabsContent value="new">
                <Form {...newLetterForm}>
                    <form onSubmit={newLetterForm.handleSubmit(onNewLetterSubmit)}>
                        <CardContent>
                             <CardDescription className="mb-4">
                                Escriba una instrucción clara para la IA. Por ejemplo: "Redacta una invitación para la graduación del programa Seeds for the Future."
                            </CardDescription>
                            <FormField
                                control={newLetterForm.control}
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="sr-only">Instrucción para nueva carta</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Ej: Redacta una carta para solicitar el préstamo del auditorio de la BINAES para el 18 de diciembre..."
                                                className="min-h-[250px] resize-y"
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
                                    "Generar Nueva Carta"
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </TabsContent>
          </Tabs>
        </Card>

        {generatedResponse && (
          <ChatRefinement 
            currentResponse={generatedResponse}
            onRefinement={handleRefinement}
            onRefiningChange={setIsRefining}
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
              <Bot size={48} className="mb-4" />
              <p>La carta generada aparecerá aquí.</p>
              <p className="text-xs text-muted-foreground/80">Seleccione una opción a la izquierda para comenzar.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
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
