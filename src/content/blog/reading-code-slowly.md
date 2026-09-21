---
title: Reading code slowly
description: A repeatable way to read an unfamiliar codebase out loud, one question at a time.
date: 2026-09-02
updatedDate: 2026-09-11
topics: [Practice, Reading]
draft: false
image: ./reading-code-cover.png
imageAlt: Poster-style cover with an ink frame around an offset red panel
---

*Placeholder article. Replace this with real writing before publishing.*

Reading code is a skill that nobody teaches directly. We teach languages, frameworks, and algorithms, then hand over a repository with a hundred thousand lines and expect comprehension to happen by exposure. It does happen, but slowly, and usually by accident.

What follows is the method I use now. It is slower than skimming and much faster than pretending to understand.

## Start with the run, not the source

The first pass does not read code at all. Run the thing, watch what it does, and write down the observable surface.

- What are the entry points?
- What does one successful request or command produce?
- What appears in the logs on a normal run?
- What fails loudly, and what fails silently?

Only after that do I open a file. The reason is simple: source code read without a runtime model is a list of unrelated statements.

## Follow one path end to end

Pick a single user visible action and trace it all the way through. One path, no detours.

1. Find the route or command definition.
2. Follow it to the function that does the work.
3. Note every external call it makes.
4. Stop when you reach storage.

```ts
// A path worth tracing looks like this: thin handler, one service call,
// and no business logic hiding in the framework glue.
export async function POST(request: Request) {
  const payload = await request.json();
  const result = await createOrder(payload);
  return Response.json(result, { status: 201 });
}
```

That is one function. The interesting part is one level down, and knowing the boundary is what makes the next file readable.

![A set of dense rules standing for a call path traced through a codebase](./reading-code-map.png)

## Write questions, not answers

Notes taken while reading code rot quickly, because the code keeps moving. Questions age better. A running list looks like this:

- Where is this value validated, and what happens when it is not?
- Who else calls this function?
- Why is this read on every request instead of cached?

The questions get answered by running the code, and the answers stick because they were earned rather than collected.

> If a note cannot be falsified by running the code, it is probably a summary, and summaries of unfamiliar code are wrong about half the time.

## Keep a scratch log

Every session gets a file with three headings: what I ran, what I expected, and what happened. It takes twenty seconds and it is the difference between a productive session and a repeated one.

| Section | Contents | Lifetime |
|---|---|---|
| What I ran | Commands, inputs, environment | One session |
| What I expected | Prediction before running | One session |
| What happened | Actual output, including the boring parts | Kept |
| Open questions | Unanswered threads | Kept until answered |

The **expected** column is the one people skip, and it is the one that produces learning. Without a prediction, an unexpected result looks like noise.

## Signals that the reading is going well

A few things reliably indicate real understanding rather than the feeling of it:

- You can predict the *next* file before opening it.
- You can describe the change you would make and name what it would break.
- You notice a missing case without being told it exists.
- The diffs you produce are small, which is the clearest sign that the mental model and the code agree.

~~Reading faster~~ Reading with a method is the whole trick. There is no shortcut that skips the model building step, but there is a repeatable order that avoids rebuilding it.

## What this costs

An honest accounting, because the method is not free:

- **Time on the first day.** The run first approach is slower than opening the biggest file.
- **Discipline.** Writing questions feels like a detour when the answer is one grep away.
- **Notes you throw away.** Most scratch logs are worthless after a week. The useful tenth is worth the rest.

If you try one thing from this article, make it the prediction habit. Write down what you expect the code to do, then run it. Everything else in this method follows from noticing when you are wrong.

See also https://example.com/reading-list for a longer bibliography on the subject.

*Placeholder article. Replace this with real writing before publishing.*
