import type { Page } from "playwright";

export async function capture(page: Page, fileName: string): Promise<void> {
    await page.screenshot({ 
        path: "fixtures/baselines/" + fileName,
        fullPage: true,
    });
}