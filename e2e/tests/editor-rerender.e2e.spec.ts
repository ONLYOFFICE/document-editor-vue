import { expect, test } from "@playwright/test";

import { API_SCRIPT_PATTERN, fakeDocsApiSource } from "./fake-docs-api";

test("keeps the editor when the parent re-renders with an equal config", async ({ page }) => {
  await page.route(API_SCRIPT_PATTERN, (route) =>
    route.fulfill({ contentType: "application/javascript", body: fakeDocsApiSource }),
  );

  await page.goto("/");

  await expect(page.locator("iframe[name='frameEditor']")).toHaveCount(1);

  await page.getByTestId("rerender").click();
  await expect(page.getByTestId("rerender")).toHaveText("rerender 1");

  expect(await page.evaluate(() => window.__e2eOpenedKeys__ ?? [])).toEqual(["e2e-test-key"]);
  await expect(page.locator("iframe[name='frameEditor']")).toHaveCount(1);
});
