# Summary

Summary helps you understand a topic well enough to explain it and answer follow-up questions. It keeps the key points, the reasoning behind them, supporting evidence, and qualifications that affect their meaning.

## Install

```sh
npx skills add chand1012/skills --skill summary
```

The skill references [Easyread](../easyread/SKILL.md) to keep summaries clear and easy to follow. Install Easyread too if your agent does not already have it:

```sh
npx skills add chand1012/skills --skill easyread
```

## Choose a level

| Level | Name | Use it to |
| --- | --- | --- |
| 1 | Brief | Get the main point, essential facts, and most important qualification. |
| 2 | Conversational — default | Discuss the topic and answer common follow-up questions. |
| 3 | Detailed | Examine the evidence, distinctions, counterarguments, and unresolved questions. |

Each level has a fixed template. Level 1 covers the takeaway, key points, an important qualification, and significance. Level 2 adds an explanation of how it works, an example, caveats, and likely questions. Level 3 expands the context, evidence, relationships, examples, and implications.

The levels control depth rather than word count. Essential qualifications stay at every level. You can also specify an audience, purpose, or length limit.

## Examples

```text
$summary Summarize this article at level 1.

$summary Summarize this report so I can discuss it with coworkers.
Audience: nontechnical. Voice: conversational.

$summary Summarize this topic at level 3 for a technical discussion.
Focus on tradeoffs and unresolved questions.
```

The second example uses level 2 because no level is specified. You can also request a level by name, such as “Brief” or “Detailed.”

When summarizing supplied material, the skill stays faithful to that material and identifies gaps. For a topic overview, it researches when needed and cites the sources it uses. It labels hypothetical examples and added interpretation instead of presenting them as source facts.

See [SKILL.md](SKILL.md) for the full templates and instructions.
