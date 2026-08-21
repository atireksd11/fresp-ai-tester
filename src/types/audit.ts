import type { TasteResult } from "./taste.js";

export type PageAudit = {
    url: string;
    shot: string;
    sections: string[];
    passed: boolean;
    notes: string;
    kind: "yours" | "example";
    taste: TasteResult;
}