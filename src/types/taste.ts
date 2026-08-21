export type TasteIssue = {
    severity: string;
    title: string;
    why: string;
    howToFix: string;
    shot: string;
};

export type PageToAdd = {
    route: string;
    name: string;
    purpose: string;
};

export type DesignMove = {
    selector: string;
    change: string;
    css: string;
};

export type ThemeSpec = {
    bg: string;
    text: string;
    accent: string;
    font: string;
    note: string;
};

export type StealNotes = {
    nav: string;
    type: string;
    colors: string;
    sections: string;
    cta: string;
    useFor: string;
};

export type TasteResult = {
    skipped: boolean;
    reason: string;
    assumedProduct: string;
    assumedGoal: string;
    factSummary: string;
    issues: TasteIssue[];
    slopHits: string[];
    readyFor: string;
    confidence: string;
    theme: string;
    features: string[];
    extras: string[];
    pagesToAdd: PageToAdd[];
    designMoves: DesignMove[];
    themeSpec: ThemeSpec;
    steal: StealNotes;
};