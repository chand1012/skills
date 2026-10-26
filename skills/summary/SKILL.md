---
name: summary
description: Summarize supplied material or a topic so the reader can explain it accurately and answer likely follow-up questions. Use for summaries, discussion preparation, and topic briefings with three verbosity levels and consistent output templates.
---

# Summary

Help the reader explain the topic accurately with as little reading effort as possible. Preserve the reasoning, evidence, and qualifications needed for the reader's purpose.

## Scope and readability

Read and apply [Easyread](../easyread/SKILL.md) when writing the summary. Use its guidance to clarify wording and relationships while preserving meaning. This skill supplies the summary structure and depth. If the sibling skill is unavailable, look for an installed `easyread` skill; if neither is available, disclose that briefly and continue using clear language, explicit connections, and faithful qualifications. Do not install dependencies automatically.

Use the requested audience, purpose, and voice to decide what information matters. Apply Easyread's audience and voice clarification guidance when these are unspecified. Treat verbosity as a depth setting, not a measure of the reader's expertise.

Distinguish two tasks:

- **Summarizing supplied material:** Stay faithful to the material. Do not silently supplement it with outside facts. Attribute claims to their source when needed, and identify unavailable or unread portions that limit coverage.
- **Summarizing a topic:** Build an overview for the stated purpose. Research when needed for accuracy, currency, or the user's request. Cite sources supporting factual claims and distinguish evidence from interpretation.

Use only sources actually read. Do not present a source's claim as independently verified. Keep citations beside the claims they support. Label added interpretation and hypothetical examples.

## Choose the verbosity

Accept a level number or name in ordinary language; no special argument syntax is required.

| Level | Name | Depth |
| --- | --- | --- |
| 1 | Brief | Orientation: main point, essential facts, and indispensable qualifications. |
| 2 | Conversational | Default: enough reasoning, evidence, context, and caveats to discuss the topic and answer common follow-ups. |
| 3 | Detailed | Preparation for deeper discussion: supporting evidence, distinctions, counterarguments, and important secondary points. |

Use **level 2** unless the user requests another depth. Interpret requests such as “briefly” or “in detail” using the matching level. These are depth targets, not fixed word counts. Do not pad a simple topic to make a higher level longer.

Honor explicit length limits. If essential information cannot fit, state the resulting coverage limit briefly within the template. Never remove a qualification that changes a retained claim's meaning just to meet a length target.

## Select information

Keep a detail if removing it would materially change the reader's understanding, judgment, or ability to explain the topic for the stated purpose. Cut repetition and incidental detail first.

Preserve the central point, the reasoning or mechanism behind it, useful supporting evidence, important qualifications, and practical significance. Retain quantities, units, dates, scope, attribution, negation, and uncertainty when they affect meaning. Do not turn correlation into causation or disagreement into consensus.

Place qualifications beside the claims they affect, even when the template also has a caveats section. Explain unfamiliar terms at first use. Group related information; aim for no more than five bullets per list, using meaningful subgroups if more are necessary. Do not suppress essential information to meet a bullet count.

## Output templates

Use the selected template's headings in the order shown. Replace placeholders with content; never print placeholder instructions. Expand repeated point and question entries only as needed. Keep headings even when evidence is missing, using a short, accurate statement such as “The source does not address this” or “No example is provided.” Missing coverage is not proof that no caveat or disagreement exists.

Avoid a preamble, repeated closing recap, or forced next action. User-requested formatting takes precedence over these templates.

### Level 1: Brief

```markdown
## Main takeaway
[One or two sentences explaining the topic and its central point.]

## Key points
- [The most important point.]
- [Additional essential points as needed.]

## Important qualification
[The condition, limitation, or uncertainty most likely to change the takeaway.]

## Why it matters
[One sentence explaining the significance for the reader's purpose.]
```

### Level 2: Conversational — default

```markdown
## Main takeaway
[A short paragraph explaining the topic, central point, and significance.]

## Key points
- **[Point]:** [Explanation and useful supporting evidence.]
- **[Additional point]:** [Repeat as needed.]

## How it works
[Explain the mechanism, argument, or sequence connecting the points.]

## Example
[One concrete example that clarifies the central idea. Label hypothetical examples.]

## Caveats and disagreements
[Important limits, exceptions, uncertainties, or competing interpretations.]

## Questions you might get
- **[Likely question]?** [Direct answer, or identify what the material cannot answer.]
- **[Additional question]?** [Repeat as needed without restating whole sections.]
```

### Level 3: Detailed

```markdown
## Main takeaway
[A self-contained overview of the topic, central conclusions, and significance.]

## Essential context
[Background, scope, and definitions needed to understand the discussion.]

## Key points and supporting evidence
### [Key point]
[Explain the claim, how or why it holds, and its supporting evidence.
Include relevant numbers, dates, attribution, and qualifications.]

### [Additional key point]
[Repeat as needed for the major points and relevant secondary points.]

## How the pieces connect
[Explain relationships, dependencies, causes, or the sequence of events.
Distinguish established relationships from proposed explanations.]

## Examples and distinctions
[Clarify difficult ideas and distinguish concepts that are easy to confuse.]

## Caveats, disagreements, and unknowns
[Limitations, competing explanations, counterarguments, and unresolved questions.]

## Implications
[What follows for the stated purpose. Distinguish source conclusions
from additional interpretation.]

## Questions you might get
- **[Question about the central explanation]?** [Answer.]
- **[Question challenging the evidence]?** [Answer.]
- **[Question about an exception or alternative]?** [Answer.]
```

## Check the result

Before returning the summary, check:

- Can the reader explain the main point and its most important limitation? At levels 2 and 3, can they also explain the reasoning and answer likely follow-ups?
- Did compression preserve the source's meaning, logical relationships, and strength of evidence? Are consequential disagreements and uncertainty visible?
- Does each section add useful information rather than repeat earlier text? Is the result easy to scan and understand on a first reading?
- Are examples, citations, and answers supported or clearly labeled? Are coverage gaps acknowledged without inventing missing content?
- Does the output follow the requested level, its template, and any audience, purpose, or length constraints?
