export function throwIfHasAPromiseReject(promises: PromiseSettledResult<any>[]) {
    const rejected = promises.find((result) => result.status === 'rejected') as PromiseRejectedResult;
    if (rejected) {
        throw rejected.reason;
    }
}

function isRejected(input: PromiseSettledResult<unknown>): input is PromiseRejectedResult {
    return input.status === 'rejected';
}

function isFulfilled<T>(input: PromiseSettledResult<T>): input is PromiseFulfilledResult<T> {
    return input.status === 'fulfilled';
}

type Awaitified<T> = { [P in keyof T]: Awaited<T[P]> };

export async function ensureCompleted<T extends unknown[]>(values: T): Promise<Awaitified<T>> {
    const results = await Promise.allSettled(values);

    const rejectedResult = results.find(isRejected);
    if (rejectedResult) {
        throw rejectedResult.reason;
    }

    return results.filter(isFulfilled).map((item) => item.value) as Awaitified<T>;
}
