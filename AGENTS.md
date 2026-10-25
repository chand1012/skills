# Repository instructions

This repository is my personal collection of skills that I've created and use daily. Keep each skill focused, easy to understand, and ready to install with the Skills CLI.

## Skill structure

- Put each skill in `skills/<skill-name>/`.
- Use a short, descriptive folder name in lowercase, with hyphens between words when needed.
- Include a `SKILL.md` file in every skill folder. Start it with YAML frontmatter containing `name` and `description`. The `name` must match the folder name, and the `description` must explain what the skill does and when an agent should use it.
- In the body of `SKILL.md`, state the skill's scope, give clear instructions, and explain how to check the result. Include limits or exceptions when they affect how the skill should be used.
- Keep the instructions needed for normal use in `SKILL.md`. Put longer examples or background material in `references/` and link to them from `SKILL.md`.
- Add `scripts/` for reusable executable helpers and `assets/` for supporting files only when the skill needs them. Do not create empty placeholder folders.
  - Do not create scripts unless the user explicitly asks you to.
  - Listen to the user when the tell you what type of script it should be. Prefer shell and system tools over all.
  - If you do write a script, follow the guide in the [script doc](docs/scripts.md).
- Use relative links for files within the repository. Check that every linked file exists.
- Add a skill-level `README.md` when users need an overview, usage examples, or background beyond the agent instructions. Keep it consistent with `SKILL.md`.
  - `README.md` should include a single line example for how to add the specific skill to your agent. See the example in [easyread](skills/easyread/README.md).
  - Always use the easyread skill to write the README to make it easy for humans to understand.

Example:

```text
skills/
  example-skill/
    SKILL.md
    README.md       # Optional user documentation
    references/     # Optional examples and background
    scripts/        # Optional executable helpers
    assets/         # Optional supporting files
```

## Keep the root README current

- Whenever you add a skill, update the root `README.md` in the same change.
- Add the skill to the "Available skills" list with its display name, a relative link to its `SKILL.md`, and a short description of what it does.
- When you rename or remove a skill, update its README entry and any installation examples or links that refer to it.
- When a skill's purpose changes, update its README description to match.
- Keep the general installation command, `npx skills add chand1012/skills`, in the README.
  - Installing just a specific skill should be in each specific skill's README.

## Writing and checks

- Use the included `skills/easyread/SKILL.md` skill when writing or revising explanatory prose. Follow the user's requested audience and voice.
- Before finishing, check that each skill has valid YAML frontmatter, that its name matches its folder, and that its instructions and supporting files agree.
- Check that the root README lists every skill and has no entries for skills that no longer exist.
- Run `git diff --check` to catch whitespace errors. If you change executable helpers, run checks appropriate to those changes.

## Browser preference

When a task requires a browser, use the Codex in-app browser first, Brave second, and Google Chrome third.
