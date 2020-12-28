import { interval, of, throwError } from "rxjs";
import { switchScan } from "rxjs/operators";

const start = async () => {
  const source = of(1, 2, 3)
  const example = source.pipe(
    switchScan((acc, value) => {
        return of(acc + value)
    }, 0)
  );

  example.subscribe(console.log);
};

start();
