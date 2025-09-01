"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bot, Download, FileText, Loader2, FileType2 } from "lucide-react";
import Image from 'next/image';

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
import { downloadAsDocx, downloadAsPdf } from "@/lib/download";

const formSchema = z.object({
  letter: z.string().min(50, {
    message: "La carta debe tener al menos 50 caracteres.",
  }),
});

export default function LetterGenerator() {
  const [generatedResponse, setGeneratedResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

  const handleDownloadPdf = () => {
    downloadAsPdf("response-content-wrapper");
  };

  const handleDownloadDocx = () => {
    downloadAsDocx(generatedResponse, "/Fondo.png");
  };

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
            Esta es la respuesta generada por la IA. Revísela y descárguela en
            el formato que prefiera.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px]">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <br />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : generatedResponse ? (
            <div id="response-content-wrapper" className="bg-white text-black font-serif text-[10.5pt] shadow-inner">
                <div id="response-content" className="prose prose-sm max-w-none whitespace-pre-wrap p-6 relative flex flex-col min-h-[842pt]">
                    <header className="text-center font-bold text-xs py-4">
                        <Image src="/Fondo.png" alt="Header" width={600} height={75} className="w-full h-auto" />
                    </header>
                    <main className="flex-grow px-10">
                        {generatedResponse}
                    </main>
                    <footer className="text-center text-xs py-4">
                        <p>Alameda Doctor Manuel Enrique Araujo No 5500, San Salvador, El Salvador, C.A.</p>
                        <p>www.presidencia.gob.sv</p>
                    </footer>
                </div>
            </div>
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
            onClick={handleDownloadDocx}
            disabled={!generatedResponse || isLoading}
          >
            <FileType2 className="mr-2 h-4 w-4" />
            Descargar .docx
          </Button>
          <Button
            variant="outline"
            onClick={handleDownloadPdf}
            disabled={!generatedResponse || isLoading}
          >
            <Download className="mr-2 h-4 w-4" />
            Descargar .pdf
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
