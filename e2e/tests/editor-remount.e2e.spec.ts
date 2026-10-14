import { expect, test } from "@playwright/test";

import { API_SCRIPT_PATTERN, fakeDocsApiSource } from "./fake-docs-api";

test("reuses the editor after the component is unmounted", async ({ page }) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.route(API_SCRIPT_PATTERN, (route) =>
    route.fulfill({ contentType: "application/javascript", body: fakeDocsApiSource }),
  );

  await page.goto("/");

  await expect(page.locator("iframe[name='frameEditor']")).toHaveCount(1);
  const readyCount = await page.evaluate(() => window.__e2eEvents__?.length ?? 0);

  await page.getByTestId("toggle-editor").click();

  await expect(page.locator("iframe[name='frameEditor']")).toHaveCount(0);
  await expect(page.locator("#e2e-editor")).toHaveCount(0);
  expect(await page.evaluate(() => !!window.DocEditor?.instances?.["e2e-editor"])).toBe(false);

  await page.getByTestId("toggle-editor").click();

  await expect(page.locator("iframe[name='frameEditor']")).toHaveCount(1);
  await expect
    .poll(() => page.evaluate(() => window.__e2eEvents__?.length ?? 0))
    .toBeGreaterThan(readyCount);

  expect(pageErrors).toEqual([]);
  expect(await page.evaluate(() => window.__e2eErrors__ ?? [])).toEqual([]);
});
