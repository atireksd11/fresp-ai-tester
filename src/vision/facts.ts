import type { Page } from "playwright";

export async function hasOverflow(page: Page): Promise<boolean> {
    return page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
}