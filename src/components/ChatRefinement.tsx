"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CornerDownLeft, Loader2, Bot, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { refineLetterResponse } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  refinementRequest: z.string().min(1, "El mensaje no puede estar vacío."),
});

type Message = {
  role: "user" | "bot";
  content: string;
};

type ChatRefinementProps = {
  originalResponse: string;
  onRefinement: (refinedResponse: string) => void;
  onRefiningChange: (isRefining: boolean) => void;
};

export default function ChatRefinement({
  originalResponse,
  onRefinement,
  onRefiningChange,
}: ChatRefinementProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const [isRefining, setIsRefining] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      refinementRequest: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsRefining(true);
    onRefiningChange(true);
    const userMessage: Message = { role: "user", content: values.refinementRequest };
    setMessages(prev => [...prev, userMessage]);

    try {
      const responseToRefine = messages.length > 0 
        ? originalResponse // This is simplistic, a more robust implementation might use the latest bot response
        : originalResponse;

      const result = await refineLetterResponse({
        originalResponse: responseToRefine,
        refinementRequest: values.refinementRequest,
      });

      if (result.error) {
        throw new Error(result.error);
      }

      if (result.refinedResponse) {
        const botMessage: Message = { role: "bot", content: result.refinedResponse };
        onRefinement(result.refinedResponse);
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al refinar la respuesta",
        description: "Hubo un problema al comunicarse con la IA. Por favor, inténtelo de nuevo.",
      });
      // Optionally remove the user message if the call fails
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsRefining(false);
      onRefiningChange(false);
      form.reset();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2">
          <Bot className="text-accent" />
          Refinar Respuesta
        </CardTitle>
        <CardDescription>
          Pide a la IA que haga cambios en la respuesta generada. Por ejemplo:
          "Cambia el destinatario a Juan Pérez".
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-64 overflow-y-auto pr-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.role === "user" ? "justify-end" : ""
              }`}
            >
              {message.role === "bot" && (
                <div className="p-2 bg-primary rounded-full text-primary-foreground">
                  <Bot size={20} />
                </div>
              )}
              {message.role === "user" && (
                 <div className="bg-muted p-3 rounded-lg max-w-sm">
                    <p className="text-sm">{message.content}</p>
                 </div>
              )}
               {message.role === "user" && (
                 <div className="p-2 bg-secondary rounded-full text-secondary-foreground">
                   <User size={20} />
                 </div>
               )}
            </div>
          ))}
           {isRefining && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex items-start gap-3">
                 <div className="p-2 bg-primary rounded-full text-primary-foreground">
                   <Loader2 size={20} className="animate-spin" />
                 </div>
              </div>
           )}
        </div>
      </CardContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardFooter className="flex items-start gap-2">
            <FormField
              control={form.control}
              name="refinementRequest"
              render={({ field }) => (
                <FormItem className="flex-grow">
                  <FormLabel className="sr-only">Tu mensaje</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Escribe tu petición aquí..."
                      {...field}
                      disabled={isRefining}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" disabled={isRefining}>
                {isRefining ? <Loader2 className="h-4 w-4 animate-spin" /> : <CornerDownLeft />}
                <span className="sr-only">Enviar</span>
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
