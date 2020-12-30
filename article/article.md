# New in RxJS 7

[RxJS](https://rxjs.dev/); one of my all-time favourite libraries is very close to releasing a new major version. Version 7 is currently in beta but is expected to release early 2021. This article briefly points out the changes of the upcoming release.

Disclaimer: this article is based on the changes up to `7.0.0-beta.9`.

_TLDR:_

- 2 New methods added,
- 2 New operators added,
- Reduced memory consumption and footprint,
- Improved configuration options,
- Improved typings.

## New methods

RxJS 7 adds two new methods; `firstValueFrom` and `lastValueFrom`. These new methods are a welcome addition to get rid of custom workarounds with Promises you had te use before to get to the same result.

### `firstValueFrom`

It subscribes to the source Observable and returns a new Promise. When the first value from the source Observable is received it will resolve the Promise and unsubscribe from the source.

```ts
import { of, firstValueFrom } from "rxjs";

const abc = of("a", "b", "c");
const firstValue = await firstValueFrom(abc);
// -> 'a'
```

When no value is received, the Promise will reject with EmptyError:

```ts
import { of, firstValueFrom } from "rxjs";

const empty = of();

try {
  await firstValueFrom(empty);
} catch (error) {
  // -> EmptyError: 'no elements in sequence'
}
```

### `lastValueFrom`

Subscribes to the source Observable and returns a new Promise. When the source Observable subscription closes it resolves the Promise.

```ts
import { of, lastValueFrom } from "rxjs";

const abc = of("a", "b", "c");
const firstValue = await lastValueFrom(abc);
// -> 'c'
```

When no value is received, it will reject with EmptyError, just like `firstValueFrom`;

```ts
import { of, lastValueFrom } from "rxjs";

const empty = of();

try {
  await lastValueFrom(empty);
} catch (error) {
  // -> EmptyError: 'no elements in sequence'
}
```

## New operators

In version 7, two new operators will be added: `concatWith` and `switchScan`.

The new `switchScan` operator was already [introduced](https://github.com/reactivex/rxjs/issues/2931) back in 2017, but was not accepted at the time. RxJS author [Ben Lesh](https://twitter.com/BenLesh) [resurrected](https://github.com/ReactiveX/rxjs/pull/4442#issuecomment-695371299) the proposal and decided to add it anyway.

### `concatWith`

Emits all of the values from the source observable, then, once it completes, subscribes to each observable source provided, one at a time, emitting all of their values, and not subscribing to the next one until it completes.

This operator works very similar to the `concat` operator which is now considered deprecated.

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

### `switchScan`

Applies an accumulator function over the source Observable where the accumulator function itself returns an Observable, emitting values only from the most recently returned Observable. It works the `switchMap` operator under the hood.

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

As you can tell it works similar to `Array.reduce` in plain Javascript.

## Renamed operators

A couple of operators are renamed for consistency and to make it more clear that the source Observable is also used in the operation.

`combineLatest` becomes `combineLatestWith`,

`zip` becomes `zipWith`,

`race` becomes `raceWith`.

At this point it's still possible to use the former operator names but they are marked as deprecated. It's expected that with the release of RxJS 8 these former names will be dropped and will not longer be exposed.

## Extended configuration options for `retry`

The `retry` operator now accepts a configuration object. We now can now also configure the operator to reset itself on a successful retry.

The option `resetOnSuccess` defaults to `false`. You can also still use the former notation: `retry(2)`.

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

## Improved typings for `groupBy`

[Type Guard](https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types) support is now added when using the `groupBy` operator. This adds extra safety to your code as shown in the example below.

```ts
import { of } from "rxjs";
import { groupBy, mergeMap } from "rxjs/operators";

type Person = {
  name: string;
};

type Pet = {
  kind: "cat" | "dog";
};

function isPerson(value: Person | Pet): value is Person {
  return "name" in value;
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

We now have improved types when using a different operator after `groupBy`. In the example above we group by `isPerson()`. When `group.key` equals to `true` it means that the current group matches our `groupBy` condition. This means that we have intellisense for the `Person` type here, and intellisense for the `Pet` type in the `else` clause. This is a great way to make our code more secure and not have to use typecasts as we had to do before.

## Dictonary support for `combineLatest`

With RxJS version 7 it's now possible to provide a dictonary to the `combineLatest` operator. In the former API you had to use the inputs for this operator as function arguments:

```ts
// Former API:
const nums$ = of(1, 2, 3);
const chars$ = of("a", "b", "c");
const bools$ = of(true, false, false);

const example = combineLatest(nums$, chars$, bools$);
// -> [ 3, 'c', true ]
```

Now we can pass a dictionary of Observables to `combineLatest`:

```ts
// New API:
const nums$ = of(1, 2, 3);
const chars$ = of("a", "b", "c");
const bools$ = of(true, false, false);

const example = combineLatest({
  number: nums$,
  character: chars$,
  boolean: bools$,
});
// -> { number: 3, character: 'c', boolean: true }
```

This is a nice way to improve the format of the combination result. No need anymore for mapping the data again to get a desirable format.

## Extended configuration for `timeout`

The `timout` operator is now more configurable.

Before; only the `due` and the `scheduler` could be provided.

Now; you can also configure:

- `each`: The time allowed between values from the source before timeout is triggered,
- `first`: Point in time where the first value should have been emitted,
- `with`: A factory used to create observable to switch to when timeout occurs (i.e. throw error),
- `meta`: Additional metadata you can provide to code that handles the timeout.

## Other noteworthy changes

- Memory usage reduced in most operators by not retaining outer values,
- Improved typings for `filter`, `groupBy`, `combineLatest`,
- Improved TestScheduler which now accepts marble diagrams,
- Wwhole bunch of bugs are fixed,
- A few [breaking changes](https://github.com/ReactiveX/rxjs/blob/master/CHANGELOG.md).

## When can I use all this? 😍

Right now! At the time of this writing, `7.0.0-beta.9` is out and ready to use. It's very stable already, but it can still contain some bugs.

The original plan for releasing RxJS 7 was by the end of 2020. This is delayed to early 2021 to be able to finish the TypeScript typings and updated documentation.

## Thanks for reading!

And have fun with all the new goodies of RxJS 7! 👐

Did I miss something? Feel free to drop a comment and I will add it to the article.

## Sources

- [RxJS 7 Roadmap](https://github.com/ReactiveX/rxjs/issues/5795)
- [RxJS Changelog](https://github.com/ReactiveX/rxjs/blob/master/CHANGELOG.md)
- [RxJS 7 release delay](https://twitter.com/BenLesh/status/1335776969611415552)
