# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`@onlyoffice/document-editor-vue` is a published npm library exposing a single Vue 3 component, `DocumentEditor`, that embeds ONLYOFFICE Document Server into user applications. The entire public API surface is the component's props (see the table in README.md); the editor itself is rendered by the third-party Document Server script, not by this code.

## Commands

```bash
npm install            # dependencies
npm run build          # rollup: emits lib/index.js (cjs) + lib/index.esm.js (esm) + .d.ts
npm run test           # jest (unit)
npm run test -- -t "renders the DocumentEditor component"   # single test by name
npm run test:e2e       # npm ci in e2e/ + build/pack the library + Playwright
npm run storybook      # dev sandbox on :6006
npm pack               # package tarball
```

Run a single e2e test (from `e2e/`, after at least one full `npm run test:e2e`):

```bash
cd e2e && npx playwright test -g "injects the Document Server script"
```

Storybook requires editing `config/default.json` — it holds the address of a real Document Server and the demo document storage.

## Architecture

**`src/components/DocumentEditor.vue`** is the only component. Lifecycle:

1. `mounted()` builds the URL `{documentServerUrl}/web-apps/apps/api/documents/api.js` and appends a `shardkey` query parameter (when the `shardkey` prop is `true`, the key comes from `config.document.key`; a string is used as-is; `false` disables it).
2. `loadScript` loads the script, then `onLoad()` calls `window.DocsAPI.DocEditor(id, initConfig)`. The load can settle long after mount, so `onLoad()`/`onError()` are skipped when the `cancelled` flag is set — otherwise an unmount during the load leaves an editor behind that nobody destroys, and the leftover registry entry makes the next mount skip loading altogether.
3. The instance is stored in the global registry `window.DocEditor.instances[id]`, which is also where `beforeUnmount()` reads it from to call `destroyEditor()`. `beforeUnmount`, not `unmounted`: Vue removes the DOM before `unmounted` runs, and `destroyEditor()` has to run while the editor is still in the document. This registry is a contract with Document Server, not an internal detail: the e2e tests and `onAppReady` read it directly.

**DOM ownership.** The template is `<div style="display: contents"><div :id="id"></div></div>`. DocsAPI *replaces* the `#id` placeholder with its own iframe, so the placeholder Vue rendered is no longer in the document while Vue still references it — on unmount Vue would remove nothing and leave the editor node behind, and the next mount would find two elements with the same `id`. The wrapper is the node Vue owns and removes, taking the iframe with it; `display: contents` keeps it out of layout so sizing still comes from the parent. Do not flatten it back to a single `<div :id="id">`, and keep comments out of the template — a comment node there turns the component into a multi-root fragment.

**Config merging.** The component accepts configuration through two paths: the `config` object (primary) and flat props (`document_fileType`, `documentType`, `editorConfig_lang`, `height`, `width`, `type`, `events_on*`). In `onLoad()` the flat props are collected into `propsConfig`, then `cloneDeep(this.config)` is layered on top via `Object.assign` — **`config` always wins** and wholesale overwrites the nested `document`/`editorConfig`/`events` branches set by flat props. `cloneDeep` is mandatory: Document Server mutates the config it is handed, and without a copy a reactive Vue object would trigger infinite re-renders.

**Editor reload.** A deep watcher on `config` plus one watcher per "important" flat prop calls `onChangeProps()`, which destroys the current instance and recreates it from scratch. Event props (`events_*`) are deliberately not watched — changing them must not tear down the editor.

The `config` watcher fires on a new object as well as on a mutation, and a caller that passes `:config="{ ... }"` hands over a new object on every render, so the watcher first compares the prop against `lastConfig` — the copy `onLoad()` took of the config the current editor was built from (a copy of its own: the one given to DocsAPI is mutated by it). Functions compare equal there (`isSameConfig`), which keeps handlers recreated alongside the literal in line with the `events_*` rule above. A deep mutation reports the same object as both `newVal` and `oldVal`, which is why the watcher arguments are useless here.

**`src/utils/loadScript.ts`** solves the race that appears with several components on one page: the script tag is marked with a `loading` attribute, and concurrent calls poll it every 500ms instead of injecting a second tag. If `window.DocsAPI` still isn't there after load, the stale tag is removed and the attempt is retried.

**Error codes** (`onError` → the `onLoadComponentError` callback): `-1` unknown error, `-2` the DocsAPI script failed to load, `-3` `window.DocsAPI` undefined after load. These codes are documented in README and covered by e2e — do not change them.

**Types.** `Config`/`DocEditor` come from the `@onlyoffice/doceditor-types` peer dependency, whose version tracks the Document Server version. This repository defines no config types of its own.

## Testing

Unit tests (`src/**/*.spec.ts`, jest + jsdom + `@vue/test-utils`; `e2e/` is ignored by `jest.config.js` and excluded from `tsconfig.json`) stub `window.DocsAPI` with a fake `DocEditor` that replaces the placeholder with an iframe and restores it on `destroyEditor()`, mirroring what Docs does to the DOM — that is what makes the mount/unmount/remount cases testable in jsdom. There is no real Document Server there; broader behaviour is still covered by e2e.

The real coverage comes from e2e in `e2e/`, which is a **separate nested npm project** (its own `package.json`, `node_modules`, tsconfig), deliberately not a workspace. `e2e/scripts/setup.mjs` builds the library, runs `npm pack`, and installs the tarball into `e2e/node_modules`, so the tests exercise the published artifact rather than `src/`. Setting `E2E_LIB_VERSION` installs a version from npm instead of building locally (used by workflow_dispatch).

No Document Server is started for e2e: `window.DocsAPI` is stubbed via `page.addInitScript`/`page.route`. `e2e/tests/fake-docs-api.ts` holds the shared URL pattern and the fake source (it swaps the placeholder for an iframe and records opened `document.key`s in `window.__e2eOpenedKeys__`); the harness app `e2e/src/App.vue` records events and errors into `window.__e2eEvents__` / `window.__e2eErrors__` and exposes `toggle-editor`, `change-key` and `rerender` buttons so the specs can unmount, remount, change the config while `api.js` is still loading, and re-render the parent with an equal one.

After changing anything under `src/`, rerun e2e in full (`npm run test:e2e`) — otherwise Playwright picks up a stale tarball.

## Conventions

- Commits go through commitlint (`@commitlint/config-conventional`); the hook is installed by lefthook.
- Every file in `src/` starts with the Apache-2.0 header "(c) Copyright Ascensio System SIA <year>".
- Releases are driven by CHANGELOG.md: a push to `master` makes the workflow read the **first** version from CHANGELOG and create a `v*` tag, and that tag triggers `npm publish`. The version must be bumped in `package.json` and given a CHANGELOG.md section in lockstep, or the release goes out wrong.
- `develop` is the development branch and PRs target it; `master` is the release branch.
