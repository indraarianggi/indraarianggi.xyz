---
title: Small tools that stick
description: The tools I still use after a year are the ones that fit in a head, not the ones with the most features.
date: 2026-05-30
topics: [Tooling, Design]
draft: false
image: ./small-tools-cover.png
imageAlt: Poster-style cover with dense rules and a thick red rule near the bottom
---

*Placeholder article. Replace this with real writing before publishing.*

I keep a folder of small programs I wrote for myself. Most are a few hundred lines. A surprising number are still in daily use a year later, and the ones that survived share a shape that has nothing to do with the problem they solve.

The tools that died were better on paper. More options, more formats, more polish. They died because using them cost a decision, and a decision is the most expensive thing a personal tool can ask for.

## What the survivors have in common

- **One input, one output.** No configuration file that must exist before anything works.
- **Predictable names.** The command is the verb and there is no subcommand tree to remember.
- **Useful when wrong.** A failed run leaves the input untouched, so the cost of trying is zero.
- **No daemon.** If it needs a process running forever, it needs to be a real service with real maintenance.
- **Readable in one sitting.** I can re-read the whole thing before changing it.

That last point does more work than it looks. A tool I can hold in my head is a tool I will fix instead of avoid.

## A worked example

Consider a tool that turns a folder of images into a contact sheet. The version I kept looks like this:

```bash
sheets ~/Pictures/scans --columns 6 --out sheet.png
```

Three flags, and the default path is the current directory. The version I deleted had a config file, a plugin system for layouts, and a template language. It produced better sheets and I stopped opening it.

```json
{
  "columns": 6,
  "gutter": 12,
  "background": "#f1efe8",
  "label": "filename"
}
```

The config above is the entire vocabulary of the tool that survived. Every key exists because a real sheet needed it, and there is no key for anything else.

![A red field crossed by a black diagonal band, standing for a short pipeline](./small-tools-loop.png)

## The failure mode to watch for

Generic tools degrade into frameworks. It happens in a specific way:

1. A second use case appears, and a flag handles it.
2. A third appears, and the flag needs a value.
3. The values need defaults, so a config file appears.
4. Someone else uses it, so the config needs to be discoverable.
5. You now maintain a small platform, and you stop using it.

The exit is to fork the tool instead. Copying three hundred lines is cheaper than carrying a configuration surface forever, and it keeps each copy honest about the one job it does.

> A personal tool should be disposable. The moment it becomes load bearing for someone else, it is not a personal tool any more.

## How I decide what to build

| Signal | Build it | Skip it |
|---|---|---|
| Frequency | Weekly or more | Twice a year |
| Manual time | Minutes each time | Seconds |
| Steps | Three or more | One |
| Error rate | Easy to get wrong by hand | Obvious when wrong |
| Existing tool | Missing or hostile | Installed and fine |

Two of the first three signals is usually enough. The exceptions are worth naming, because they cut against the table:

- **Build it sooner**
  - The manual step sits on the critical path of something else.
  - The mistake it prevents is expensive to notice later.
- **Wait longer**
  - The complaint is about the interface rather than the outcome.
  - Covering the second use case would require a configuration surface.

## Keeping them small

- **Write the usage line first.** If it does not fit on one line, the scope is wrong.
- **Refuse configuration until the second use case.** A default that is right most of the time beats an option.
- **Make the failure mode boring.** Print the reason and exit non zero.
- **Delete the clever parts.** The loop that handles every case is the loop nobody can debug later.
- **Set a size budget.** Mine is five hundred lines. Exceeding it means the tool has two jobs.

The measure of a small tool is not how much it does. It is how often you reach for it without hesitating, which is a property of the interface rather than the feature list.

*Placeholder article. Replace this with real writing before publishing.*
