import { of, combineLatest } from "rxjs";
import { combineLatestWith } from "rxjs/operators";

const start = async () => {
  const nums$ = of(1, 2, 3)
  const chars$ = of('a', 'b', 'c')
  const bools$ = of(true, false, false)

    const example = combineLatest({
        n: nums$,
        c: chars$,
        b: bools$
    })

    example.subscribe(console.log)

    const example2 = combineLatest(nums$, chars$, bools$)

    example2.subscribe(console.log)
};

start();
