# Scripting guide

These rules apply to both human contributors and agents. Prefer shell scripts and existing system tools. When a task needs Python, use `uv` with PEP 723 metadata. When it needs TypeScript or JavaScript, use Bun with versioned package imports. Keep small helpers directly executable and put their dependencies in the file whenever the runtime supports it.

## When to create a script

Add a script when the task calls for a reusable executable helper. Follow any language or runtime requirements for the task. Otherwise, choose the simplest option that handles it clearly:

| Use | When it fits | How to declare dependencies |
| --- | --- | --- |
| Shell | Run commands, connect existing tools, or manage files. This is the default. | List the shell and external commands in header comments. Check required commands before using them. |
| Python with `uv` | Use Python libraries or write logic that would be awkward in shell. | Put the Python version and packages in a PEP 723 comment block. |
| TypeScript or JavaScript with Bun | Use npm libraries or APIs that fit the JavaScript ecosystem. | Put package versions directly in import statements near the top of the file. |

For helpers that belong to a skill, use `skills/<skill-name>/scripts/`. Do not create an empty `scripts/` folder.

## Rules for every script

- Put the shebang on the first line. This line tells the operating system which program should run the file.
- State the purpose, usage, runtime, and dependencies near the top.
- Make the file executable with `chmod +x path/to/script` and check that `./path/to/script` works.
- Keep a small standalone helper in one file when practical. Avoid adding a package manifest or a manual environment setup just to run it.
- Declare every external dependency. Prefer built-in features when they do the job clearly.
- For saved Python and Bun helpers, pin direct package dependencies to exact versions. Update those versions deliberately and check the script again.
- Print useful errors to standard error and return a nonzero exit status when the task fails.

The examples below are small, complete scripts that show the expected headers. The package versions illustrate exact pins; they are not claims about the latest releases.

## Shell: list and check required commands

Use the shell that matches the script. Use `sh` for portable shell syntax or Bash when Bash features make the script clearer. Do not assume that the interactive shell is the right interpreter.

This Bash example reads a JSON object from a file and prints its keys:

```bash
#!/usr/bin/env bash
# Purpose: Print the keys of a JSON object.
# Usage: ./json-keys.sh input.json
# Runtime: Bash 3.2 or newer.
# Dependencies: jq 1.6 or newer, installed separately and available on PATH.

set -euo pipefail

if ! command -v jq >/dev/null 2>&1; then
  printf 'Error: jq is required. Install jq 1.6 or newer.\n' >&2
  exit 1
fi

if [ "$#" -ne 1 ]; then
  printf 'Usage: %s input.json\n' "$0" >&2
  exit 1
fi

jq -r 'keys[]' "$1"
```

Shell has no standard inline package installer. The dependency comment documents the requirement; it does not install anything. The `command -v` check verifies that `jq` is available, but does not enforce its version. Add a version check when the script depends on features that older installations may lack.

Keep required tools explicit and report missing tools before doing work. Do not silently install system packages. Quote paths and arguments so spaces in filenames work.

## Python: use PEP 723 and `uv`

Put the runtime requirement and third-party packages in a `# /// script` block directly below the shebang. PEP 723 defines this metadata format; `uv` reads it and prepares an environment for the script. This avoids a manual virtual environment or a separate requirements file for a small helper. See the [Cottongeeks example](https://www.cottongeeks.com/articles/2025-06-24-fun-with-uv-and-pep-723) and the [uv script guide](https://docs.astral.sh/uv/guides/scripts/).

```python
#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "rich==13.9.4",
# ]
# ///
# Purpose: Print a formatted greeting.
# Usage: ./greet.py
# Launcher: uv, installed separately and available on PATH.

from rich import print

print("[green]Hello![/green]")
```

Keep `--script` in the shebang. The `-S` option lets `env` split the interpreter command into its arguments. Direct execution requires an `env` implementation that supports `-S`.

The `dependencies` array contains package requirements, not import names. If the script uses only the Python standard library, keep the metadata block and set `dependencies = []`.

With inline metadata, `uv` uses the script's dependencies and ignores the surrounding project's dependencies. It can download a compatible Python version when needed. Package and Python downloads require network access unless the required files are already available. These behaviors are documented in the [uv script guide](https://docs.astral.sh/uv/guides/scripts/).

Run the script directly after making it executable:

```sh
chmod +x greet.py
./greet.py
```

The equivalent launcher command is `uv run --script greet.py`. Running `python greet.py` skips uv's environment setup.

To add or update a dependency, use `uv add --script greet.py 'rich==13.9.4'` or edit the metadata. If repeatable dependency resolution matters, run `uv lock --script greet.py` and keep the resulting `greet.py.lock` beside the script. Exact direct dependency pins alone do not freeze the dependencies of those packages. See [uv's script locking documentation](https://docs.astral.sh/uv/guides/scripts/#locking-dependencies).

## TypeScript and JavaScript: use Bun and versioned imports

For a standalone Bun script, declare npm dependencies through versioned imports. Bun can download imported packages into its shared cache, so the script does not need its own `package.json` or a separate install step. See [Bun's auto-install documentation](https://bun.sh/docs/runtime/auto-install).

This example works as either `greet.ts` or `greet.js` because it uses syntax that both languages accept:

```javascript
#!/usr/bin/env -S bun --install=force
// Purpose: Validate and print a greeting.
// Usage: ./greet.ts Chandler (or ./greet.js Chandler)
// Runtime: Bun, installed separately and available on PATH.
// Dependencies: zod@3.24.2, declared in the import below.

import { z } from "zod@3.24.2";

const name = z.string().min(1).parse(Bun.argv[2]);
console.log(`Hello, ${name}!`);
```

The version in `"zod@3.24.2"` is the dependency definition. The header comment explains it for readers. Bun uses the import itself to select the package version; PEP 723 comment blocks apply to Python scripts. Prefer an exact version over an unversioned import, `latest`, or a version range for saved helpers. Bun documents this syntax under [version specifiers](https://bun.sh/docs/runtime/auto-install#version-specifiers).

The shebang explicitly selects Bun and forces auto-install resolution even when a surrounding directory has `node_modules`. Without that flag, Bun's default auto-install behavior depends on whether it finds `node_modules`. Local configuration can still disable auto-install; in that case, resolve the configuration or use an explicit project install. Do not delete an existing `node_modules` directory to make a helper run. See [Bun's runtime options](https://bun.sh/docs/runtime#dependency-module-resolution) and [auto-install rules](https://bun.sh/docs/runtime/auto-install).

Run the TypeScript version with:

```sh
chmod +x greet.ts
./greet.ts Chandler
```

The equivalent launcher command is `bun --install=force ./greet.ts Chandler`. Use the same commands with `greet.js` for JavaScript. Bun runs TypeScript directly without a separate compilation step; normal execution does not check types. See [Bun's runtime documentation](https://bun.sh/docs/runtime#run-a-file).

Keep external imports near the top so readers can find all package requirements. Exact import versions pin direct packages, but do not provide a complete lock of their dependency trees. If a helper grows to need a locked dependency tree or a build process, use a project with a manifest and lockfile rather than forcing it into one file.

## Check before finishing

1. Check that the script serves the task and meets its language and runtime requirements.
2. Check that the header matches the actual imports, commands, runtime, and arguments.
3. Check syntax with the selected runtime or its available validation tools.
4. Run the file directly with representative input. Check missing arguments and invalid input when they apply.
5. Confirm that the script does not rely on undeclared packages, an active virtual environment, or an unrelated project's installed dependencies.
6. Run `git diff --check` before submitting repository changes.

## Background

This guide follows the repository's shell-first preference. Background sources include [Inline Dependencies in Bun and Node](chatgpt-conversation://6add3926-8df0-83ea-a9e4-e355e1ec31bb), the linked Cottongeeks article, and the official uv and Bun documentation cited above.
