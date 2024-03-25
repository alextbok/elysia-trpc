import { TRPCError } from "@trpc/server";
export function transformTRPCResponseItem(router, item) {
    if ("error" in item) {
        return {
            ...item,
            error: router._def._config.transformer.output.serialize(item.error),
        };
    }
    if ("data" in item.result) {
        return {
            ...item,
            result: {
                ...item.result,
                data: router._def._config.transformer.output.serialize(item.result.data),
            },
        };
    }
    return item;
}
export function transformTRPCResponse(router, itemOrItems) {
    return Array.isArray(itemOrItems)
        ? itemOrItems.map((item) => transformTRPCResponseItem(router, item))
        : transformTRPCResponseItem(router, itemOrItems);
}
export function getMessageFromUnknownError(err, fallback) {
    if (typeof err === "string") {
        return err;
    }
    if (err instanceof Error && typeof err.message === "string") {
        return err.message;
    }
    return fallback;
}
export function getErrorFromUnknown(cause) {
    if (cause instanceof Error) {
        return cause;
    }
    const message = getMessageFromUnknownError(cause, "Unknown error");
    return new Error(message);
}
export function getTRPCErrorFromUnknown(cause) {
    const error = getErrorFromUnknown(cause);
    if (error instanceof TRPCError) {
        return cause;
    }
    const trpcError = new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: error,
        message: error.message,
    });
    trpcError.stack = error.stack;
    return trpcError;
}
export function getCauseFromUnknown(cause) {
    if (cause instanceof Error) {
        return cause;
    }
    return undefined;
}
