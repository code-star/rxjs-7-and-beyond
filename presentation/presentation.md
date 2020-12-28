# RxJS 7 & Beyond

## Introduction
...

## What is RxJS
...

## Why RxJS
...

## What's new in RxJS 7

### New method `firstValueFrom`
Subscribes to the input Observable and returns a new Promise. When the first value from the input Observable is received it will resolve the Promise.

When no value is received, it will reject with EmptyError.

#### Example `firstValueFrom`
```ts
import { of, firstValueFrom } from 'rxjs'

const abc = of('a', 'b', 'c')
const firstValue = await firstValueFrom(abc)
// -> 'a'
```

#### Example `firstValueFrom` with error
```ts
import { of, firstValueFrom } from 'rxjs'

const empty = of()

try {
    await firstValueFrom(empty)
} catch (error) {
    // -> EmptyError: 'no elements in sequence'
}
```

### New method `lastValueFrom`
Subscribes to the input Observable and returns a new Promise. When the input Observable subsciptions closes it resolves the Promise.

When no value is received, it will reject with EmptyError, just like `firstValueFrom`.

#### Example `lastValueFrom`
```ts
import { of, lastValueFrom } from 'rxjs'

const abc = of('a', 'b', 'c')
const firstValue = await lastValueFrom(abc)
// -> 'c'
```

#### Example `lastValueFrom` with error
```ts
import { of, lastValueFrom } from 'rxjs'

const empty = of()

try {
    await lastValueFrom(empty)
} catch (error) {
    // -> EmptyError: 'no elements in sequence'
}
```

