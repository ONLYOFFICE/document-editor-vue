import { execSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const e2eRoot = join(__dirname, "..");
const repoRoot = join(e2eRoot, "..");
const tmpDir = join(e2eRoot, ".tmp");
const libVersion = process.env.E2E_LIB_VERSION?.trim();

function run(cmd, args, cwd) {
  const commandLine = [cmd, ...args.map((arg) => (arg.includes(" ") ? `"${arg}"` : arg))].join(" ");
  console.log(`> (${cwd}) ${commandLine}`);
  execSync(commandLine, { cwd, stdio: "inherit" });
}

if (libVersion) {
  console.log(`== Installing @onlyoffice/document-editor-vue@${libVersion} from npm ==`);
  run("npm", ["install", `@onlyoffice/document-editor-vue@${libVersion}`, "--no-save"], e2eRoot);
} else {
  console.log("== Building @onlyoffice/document-editor-vue ==");
  run("npm", ["run", "build"], repoRoot);

  rmSync(tmpDir, { recursive: true, force: true });
  mkdirSync(tmpDir, { recursive: true });

  console.log("== Packing library ==");
  run("npm", ["pack", "--pack-destination", tmpDir], repoRoot);

  const tarball = readdirSync(tmpDir).find((file) => file.endsWith(".tgz"));
  if (!tarball) {
    throw new Error(`No .tgz produced in ${tmpDir}`);
  }
  const tarballPath = join(tmpDir, tarball);

  console.log(`== Installing ${tarball} into e2e/node_modules ==`);
  run("npm", ["install", tarballPath, "--no-save"], e2eRoot);
}

console.log("== Done ==");
