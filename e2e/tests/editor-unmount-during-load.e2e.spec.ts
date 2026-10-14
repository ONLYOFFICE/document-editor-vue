import { expect, test } from "@playwright/test";

import { API_SCRIPT_PATTERN, fakeDocsApiSource } from "./fake-docs-api";

test("creates no editor when unmounted while api.js is still loading", async ({ page }) => {
  let releaseScript!: () => void;
  const scriptHeld = new Promise<void>((resolve) => {
    releaseScript = resolve;
  });

  await page.route(API_SCRIPT_PATTERN, async (route) => {
    await scriptHeld;
    await route.fulfill({ contentType: "application/javascript", body: fakeDocsApiSource });
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page.locator("script#onlyoffice-api-script")).toHaveCount(1);

  await page.getByTestId("toggle-editor").click();

  releaseScript();

  await expect.poll(() => page.evaluate(() => !!window.DocsAPI)).toBe(true);

  expect(await page.evaluate(() => window.__e2eOpenedKeys__ ?? [])).toEqual([]);
  expect(await page.evaluate(() => !!window.DocEditor?.instances?.["e2e-editor"])).toBe(false);
  expect(await page.evaluate(() => window.__e2eErrors__ ?? [])).toEqual([]);
  await expect(page.locator("iframe[name='frameEditor']")).toHaveCount(0);
});
