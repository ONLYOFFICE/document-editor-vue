import { expect, test } from "@playwright/test";

import { API_SCRIPT_PATTERN, fakeDocsApiSource } from "./fake-docs-api";

test("builds the editor from the config it has when api.js arrives", async ({ page }) => {
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
  expect(await page.evaluate(() => !!window.DocsAPI)).toBe(false);

  await page.getByTestId("change-key").click();

  releaseScript();

  await expect(page.locator("iframe[name='frameEditor']")).toHaveCount(1);
  await expect
    .poll(() => page.evaluate(() => window.__e2eOpenedKeys__ ?? []))
    .toEqual(["e2e-changed-key"]);
});
