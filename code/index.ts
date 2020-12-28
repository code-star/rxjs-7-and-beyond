import { EMPTY, lastValueFrom, of } from 'rxjs';

const start = async () => {
    const abc = of('a', 'b', 'c')
    const empty = of()

    try {
        const lastValue = await lastValueFrom(empty)
        console.log(lastValue)
    } catch (error) {
        console.log(error);
    }
}

start();
