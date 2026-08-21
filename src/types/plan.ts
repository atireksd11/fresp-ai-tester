export type PlanSection = {
    name: string;
    what: string;
  };
  
  export type PlanPage = {
    order: number;
    route: string;
    title: string;
    purpose: string;
    h1: string;
    primaryButton: string;
    from: string;
    sections: PlanSection[];
    html: string;
  };
  
  export type RebuildPlan = {
    skipped: boolean;
    reason: string;
    projectName: string;
    verdict: string;
    destroyFirst: boolean;
    font: string;
    colors: string;
    images: string;
    css: string;
    pages: PlanPage[];
  };