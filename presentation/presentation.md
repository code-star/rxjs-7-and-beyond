# RxJS 7 & Beyond

## Introduction

...

## What is RxJS

...

## Why RxJS

...

## What's new in RxJS 7

### New method `firstValueFrom`

Subscribes to the source Observable and returns a new Promise. When the first value from the source Observable is received it will resolve the Promise.

When no value is received, it will reject with EmptyError.

#### Example `firstValueFrom`

```ts
import { of, firstValueFrom } from "rxjs";

const abc = of("a", "b", "c");
const firstValue = await firstValueFrom(abc);
// -> 'a'
```

#### Example `firstValueFrom` with error

```ts
import { of, firstValueFrom } from "rxjs";

const empty = of();

try {
  await firstValueFrom(empty);
} catch (error) {
  // -> EmptyError: 'no elements in sequence'
}
```

### New method `lastValueFrom`

Subscribes to the source Observable and returns a new Promise. When the source Observable subsciptions closes it resolves the Promise.

When no value is received, it will reject with EmptyError, just like `firstValueFrom`.

#### Example `lastValueFrom`

```ts
import { of, lastValueFrom } from "rxjs";

const abc = of("a", "b", "c");
const firstValue = await lastValueFrom(abc);
// -> 'c'
```

#### Example `lastValueFrom` with error

```ts
import { of, lastValueFrom } from "rxjs";

const empty = of();

try {
  await lastValueFrom(empty);
} catch (error) {
  // -> EmptyError: 'no elements in sequence'
}
```

### New operator `concatWith`

Emits all of the values from the source observable, then, once it completes, subscribes to each observable source provided, one at a time, emitting all of their values, and not subscribing to the next one until it completes.

#### Example `concatWith` operator

```ts
import { fromEvent } from "rxjs";
import { concatWith } from "rxjs/operators";

const clicks = fromEvent(document, "click");
const moves = fromEvent(document, "mousemove");

clicks.pipe(
  map(() => "click"),
  take(1),
  concatWith(moves.pipe(map(() => "move")))
);
// -> 'click', 'move', 'move', 'move'
```

### New operator `switchScan`

The new `switchScan` operator, a proposal from 2017 is now added.

Applies an accumulator function over the source Observable where the accumulator function itself returns an Observable, emitting values only from the most recently returned Observable. It works the `switchMap` operator under the hood.

It works similar to `Array.reduce` in plain Javascript.

#### Example `switchScan` operator

```ts
import { of } from "rxjs";
import { switchScan } from "rxjs/operators";

const source = of(1, 2, 3);
const example = source.pipe(
  switchScan((acc, value) => {
    return of(acc + value);
  }, 0)
);
// -> 1, 3, 6
```

### Renamed operators

A couple of operators are renamed for consistency and to make it more clear that the source Observable is also used in the operation.

- `combineLatest` -> `combineLatestWith`
- `zip` -> `zipWith`
- `race` -> `raceWith`

At this point it's still possible to use the former operator names but they are marked as deprecated.

### Extended configuration options for `retry`

The `retry` operator now accepts a configuration object. We now can now also configure the operator to reset itself on a successful retry.

The option `resetOnSuccess` defaults to `false`. You can also still use the former notation: `retry(2)`.

#### Example `retry` configuration

```ts
import { interval, of, throwError } from "rxjs";
import { mergeMap, retry } from "rxjs/operators";

const source = interval(1000);
const example = source.pipe(
  mergeMap((val) => {
    if (val > 5) {
      return throwError(() => new Error("Error!"));
    }
    return of(val);
  }),
  retry({
    count: 2,
    resetOnSuccess: true, // new!
  })
);
```

### Improved typings for `groupBy` operator (Type Guard support)
```ts
function isPerson(value: Person | Pet): value is Person {
  return value.hasOwnProperty("name");
}

const person: Person = { name: "Judy" };
const pet: Pet = { kind: "cat" };

const o = of(person, pet).pipe(
  groupBy(isPerson),
  mergeMap((group) => {
    if (group.key) {
      const inferred = group; // -> Person
      return inferred;
    } else {
      const inferred = group; // -> Pet
      return inferred;
    }
  })
);
```

### Dictonary support for `combineLatest`

**Former API:**

```ts
const nums$ = of(1, 2, 3)
const chars$ = of('a', 'b', 'c')
const bools$ = of(true, false, false)

const example = combineLatest(nums$, chars$, bools$)
// -> [ 3, 'c', true ]
```

**New API:**

```ts
const nums$ = of(1, 2, 3)
const chars$ = of('a', 'b', 'c')
const bools$ = of(true, false, false)

const example = combineLatest({
    number: nums$,
    character: chars$,
    boolean: bools$
})
// -> { number: 3, character: 'c', boolean: true }
```

### Extended configuration for `timeout`

...

### Other noteworthy changes

- Memory usage reduced in most operators by not retaining outer values
- Improved typings for `filter`, `groupBy`, `combineLatest`
- TestScheduler
- Wwhole bunch of bugs are fixed
- A few breaking changes

## What's next?

... rxjs > 8

## Sources

- https://github.com/ReactiveX/rxjs/issues/5795
- https://github.com/ReactiveX/rxjs/blob/master/CHANGELOG.md
