import { expect, test } from "@playwright/test";

import { API_SCRIPT_PATTERN, fakeDocsApiSource } from "./fake-docs-api";

test("initializes the editor when window.DocsAPI is already present", async ({ page }) => {
  await page.addInitScript(fakeDocsApiSource);

  await page.goto("/");

  await expect.poll(() => page.evaluate(() => window.__e2eEvents__)).toEqual(["appReady"]);

  const hasInstance = await page.evaluate(
    () => !!window.DocEditor?.instances?.["e2e-editor"],
  );
  expect(hasInstance).toBe(true);

  await expect(page.locator("script#onlyoffice-api-script")).toHaveCount(0);
});

test("injects the Document Server script and initializes through it", async ({ page }) => {
  let requestedUrl: URL | undefined;

  await page.route(API_SCRIPT_PATTERN, async (route) => {
    requestedUrl = new URL(route.request().url());
    await route.fulfill({ contentType: "application/javascript", body: fakeDocsApiSource });
  });

  await page.goto("/");

  await expect(page.locator("script#onlyoffice-api-script")).toHaveCount(1);
  await expect.poll(() => page.evaluate(() => window.__e2eEvents__)).toEqual(["appReady"]);

  expect(requestedUrl?.searchParams.get("shardkey")).toBeTruthy();
});

test("reports error code -2 when the Document Server script fails to load", async ({ page }) => {
  await page.route(API_SCRIPT_PATTERN, (route) => route.abort());

  await page.goto("/");

  await expect
    .poll(() => page.evaluate(() => window.__e2eErrors__?.[0]?.errorCode))
    .toBe(-2);
});
