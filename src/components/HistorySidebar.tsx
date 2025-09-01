"use client";

import { useLocalStorage } from "@/hooks/use-local-storage";
import { LetterHistory } from "@/lib/types";
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "./ui/sidebar";
import { FileText } from "lucide-react";

type HistorySidebarProps = {
    onSelectLetter: (letter: LetterHistory) => void;
};

export default function HistorySidebar({ onSelectLetter }: HistorySidebarProps) {
    const [history] = useLocalStorage<LetterHistory[]>("letterHistory", []);

    if (history.length === 0) {
        return (
            <div className="p-4 text-sm text-sidebar-foreground/70 text-center group-data-[collapsible=icon]:hidden">
                No hay cartas generadas todavía.
            </div>
        );
    }

    return (
        <SidebarMenu>
            {history.map((item) => (
                <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                        onClick={() => onSelectLetter(item)}
                        tooltip={item.finalResponse.substring(0, 100) + '...'}
                    >
                        <FileText />
                        <span>{item.finalResponse.substring(0, 25) + '...'}</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            ))}
        </SidebarMenu>
    );
}
