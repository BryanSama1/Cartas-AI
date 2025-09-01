"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bot, FileText, Loader2, Clipboard } from "lucide-react";

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

const formSchema = z.object({
  letter: z.string().min(50, {
    message: "La carta debe tener al menos 50 caracteres.",
  }),
});

export default function LetterGenerator() {
  const [generatedResponse, setGeneratedResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const responseRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      letter: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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

      setGeneratedResponse(result.response ?? "");
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
    .replace(/\n/g, "<br />");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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
                  "Generar Respuesta"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

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
        <CardContent className="min-h-[300px] p-2">
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
            <div 
              ref={responseRef} 
              className="bg-white text-black p-6 rounded-md shadow-inner text-sm font-sans whitespace-pre-wrap min-h-[300px] focus:outline-none focus:ring-2 focus:ring-ring"
              contentEditable={true}
              dangerouslySetInnerHTML={{ __html: formattedResponse }} 
              suppressContentEditableWarning={true}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
              <FileText size={48} className="mb-4" />
              <p>La respuesta generada aparecerá aquí.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            disabled={!generatedResponse || isLoading}
          >
            <Clipboard className="mr-2 h-4 w-4" />
            Copiar Respuesta
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}