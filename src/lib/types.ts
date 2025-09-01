export type Message = {
    role: "user" | "bot";
    content: string;
};

export type LetterHistory = {
    id: string;
    originalLetter: string;
    finalResponse: string;
    history: Message[];
    createdAt: Date;
};
