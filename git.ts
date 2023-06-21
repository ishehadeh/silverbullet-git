import { shell } from "$sb/plugos-syscall/mod.ts";
import { editor, system } from "$sb/silverbullet-syscall/mod.ts";

const GIT_BIN = "git";

export async function commit(message?: string) {
  if (!message) {
    message = "Snapshot";
  }
  console.log(
    "Snapshotting the current space to git with commit message",
    message,
  );
  const { code } = await shell.run(GIT_BIN, ["add", "./*.md"]);
  console.log("Git add code", code);
  try {
    await shell.run(GIT_BIN, ["commit", "-a", "-m", message]);
  } catch {
    // We can ignore, this happens when there's no changes to commit
  }
  console.log("Done!");
}

export async function snapshotCommand() {
  let revName = await editor.prompt(`Revision name:`);
  if (!revName) {
    revName = "Snapshot";
  }
  console.log("Revision name", revName);
  await system.invokeFunction("server", "commit", revName);
}

export async function syncCommand() {
  await editor.flashNotification("Syncing with git");
  await system.invokeFunction("server", "sync");
  await editor.flashNotification("Git sync complete!");
}

export async function sync() {
  console.log("Going to sync with git");
  await commit();
  console.log("Then pulling from remote");
  await shell.run(GIT_BIN, ["pull"]);
  console.log("And then pushing to remote");
  await shell.run(GIT_BIN, ["push"]);
  console.log("Done!");
}
