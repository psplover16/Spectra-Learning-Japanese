import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ROOT_ENTRIES_ALWAYS_PRESERVED = new Set(['.git', '.nojekyll', 'CNAME', 'staging']);

async function pathExists(targetPath) {
  try {
    await stat(targetPath);
    return true;
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return false;
    }

    throw error;
  }
}

async function listEntries(directoryPath) {
  if (!(await pathExists(directoryPath))) {
    return [];
  }

  return (await readdir(directoryPath)).sort((left, right) => left.localeCompare(right));
}

async function removeEntry(targetPath) {
  await rm(targetPath, { recursive: true, force: true });
}

async function emptyDirectory(directoryPath) {
  await mkdir(directoryPath, { recursive: true });
  const entries = await listEntries(directoryPath);

  for (const entry of entries) {
    await removeEntry(path.join(directoryPath, entry));
  }

  return entries;
}

async function copyDirectoryContents(sourceDirectoryPath, targetDirectoryPath) {
  await mkdir(targetDirectoryPath, { recursive: true });

  const entries = await listEntries(sourceDirectoryPath);

  if (entries.length === 0) {
    throw new Error(`No build output found in ${sourceDirectoryPath}`);
  }

  for (const entry of entries) {
    await cp(path.join(sourceDirectoryPath, entry), path.join(targetDirectoryPath, entry), {
      force: true,
      recursive: true
    });
  }

  return entries;
}

async function isUnsafeSourceIndexHtml(indexPath) {
  if (!(await pathExists(indexPath))) {
    return false;
  }

  const content = await readFile(indexPath, 'utf8');
  return content.includes('/src/');
}

function resolvePublishTarget(target) {
  if (target === 'production') {
    return {
      name: 'production',
      publishSubdir: ''
    };
  }

  if (target === 'staging') {
    return {
      name: 'staging',
      publishSubdir: 'staging'
    };
  }

  throw new Error(`Unsupported publish target: ${target}`);
}

async function cleanupRootForProduction(worktreeRoot) {
  const entries = await listEntries(worktreeRoot);
  const removedEntries = [];

  for (const entry of entries) {
    if (ROOT_ENTRIES_ALWAYS_PRESERVED.has(entry)) {
      continue;
    }

    await removeEntry(path.join(worktreeRoot, entry));
    removedEntries.push(entry);
  }

  return removedEntries.sort((left, right) => left.localeCompare(right));
}

async function cleanupRootForStaging(worktreeRoot, distRootEntries) {
  const allowedEntries = new Set([...ROOT_ENTRIES_ALWAYS_PRESERVED, ...distRootEntries]);
  const entries = await listEntries(worktreeRoot);
  const removedEntries = [];

  for (const entry of entries) {
    if (!allowedEntries.has(entry)) {
      await removeEntry(path.join(worktreeRoot, entry));
      removedEntries.push(entry);
      continue;
    }

    if (entry === 'index.html' && (await isUnsafeSourceIndexHtml(path.join(worktreeRoot, entry)))) {
      await removeEntry(path.join(worktreeRoot, entry));
      removedEntries.push(entry);
    }
  }

  return removedEntries.sort((left, right) => left.localeCompare(right));
}

async function ensureNoJekyll(worktreeRoot) {
  await writeFile(path.join(worktreeRoot, '.nojekyll'), '', 'utf8');
}

export function formatPublishSummary(result) {
  const removedRootCount = result.removedRootEntries.length;
  const removedTargetCount = result.removedTargetEntries.length;
  const copiedCount = result.copiedEntries.length;

  return [
    `Prepared ${result.target} publish content.`,
    `Target path: ${result.targetPath}`,
    `Removed root entries: ${removedRootCount}`,
    `Removed target entries: ${removedTargetCount}`,
    `Copied entries: ${copiedCount}`
  ].join(' ');
}

export function formatNoPublishChangesMessage(target) {
  return `No publish changes to commit for ${target}.`;
}

export async function syncPublishedSite({ worktreeRoot, distPath, target }) {
  const publishTarget = resolvePublishTarget(target);
  const distRootEntries = await listEntries(distPath);

  if (distRootEntries.length === 0) {
    throw new Error(`No build output found in ${distPath}`);
  }

  const removedRootEntries =
    publishTarget.name === 'production'
      ? await cleanupRootForProduction(worktreeRoot)
      : await cleanupRootForStaging(worktreeRoot, distRootEntries);

  const targetPath = publishTarget.publishSubdir
    ? path.join(worktreeRoot, publishTarget.publishSubdir)
    : worktreeRoot;

  const removedTargetEntries = publishTarget.publishSubdir ? await emptyDirectory(targetPath) : [];
  const copiedEntries = await copyDirectoryContents(distPath, targetPath);
  await ensureNoJekyll(worktreeRoot);

  return {
    target: publishTarget.name,
    targetPath,
    removedRootEntries,
    removedTargetEntries,
    copiedEntries
  };
}

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith('--')) {
      throw new Error(`Unexpected argument: ${token}`);
    }

    const key = token.slice(2);
    const value = argv[index + 1];

    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for argument: --${key}`);
    }

    parsed[key] = value;
    index += 1;
  }

  return parsed;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = await syncPublishedSite({
    worktreeRoot: path.resolve(args.worktree),
    distPath: path.resolve(args.dist),
    target: args.target
  });

  console.log(formatPublishSummary(result));
}

const executedPath = process.argv[1] ? path.resolve(process.argv[1]) : '';
const isDirectExecution = executedPath === path.resolve(import.meta.filename);

if (isDirectExecution) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
