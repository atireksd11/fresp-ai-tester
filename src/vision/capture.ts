import type { Page } from "playwright";

export async function capture(page: Page, fileName: string): Promise<void> {
    await page.screenshot({ 
        path: "fixtures/baselines/" + fileName,
        fullPage: true,
    });
}

export async function captureSections(page: Page, pageName: string): Promise<string[]> {
    const sections = page.locator("section");
    const total = await sections.count();
    const n = total < 4 ? total : 4;
    const files: string[] = [];
    for (let i = 0; i < n; i++) {
      const el = sections.nth(i);
      const file = pageName + "-s" + String(i) + ".png";
      try {
        if (!(await el.isVisible())) {
          continue;
        }
        await el.screenshot({
          path: "fixtures/baselines/" + file,
          timeout: 4000,
        });
        files.push(file);
      } catch {
        continue;
      }
    }
    return files;
  }