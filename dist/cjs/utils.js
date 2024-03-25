"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCauseFromUnknown = exports.getTRPCErrorFromUnknown = exports.getErrorFromUnknown = exports.getMessageFromUnknownError = exports.transformTRPCResponse = exports.transformTRPCResponseItem = void 0;
const server_1 = require("@trpc/server");
function transformTRPCResponseItem(router, item) {
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
exports.transformTRPCResponseItem = transformTRPCResponseItem;
function transformTRPCResponse(router, itemOrItems) {
    return Array.isArray(itemOrItems)
        ? itemOrItems.map((item) => transformTRPCResponseItem(router, item))
        : transformTRPCResponseItem(router, itemOrItems);
}
exports.transformTRPCResponse = transformTRPCResponse;
function getMessageFromUnknownError(err, fallback) {
    if (typeof err === "string") {
        return err;
    }
    if (err instanceof Error && typeof err.message === "string") {
        return err.message;
    }
    return fallback;
}
exports.getMessageFromUnknownError = getMessageFromUnknownError;
function getErrorFromUnknown(cause) {
    if (cause instanceof Error) {
        return cause;
    }
    const message = getMessageFromUnknownError(cause, "Unknown error");
    return new Error(message);
}
exports.getErrorFromUnknown = getErrorFromUnknown;
function getTRPCErrorFromUnknown(cause) {
    const error = getErrorFromUnknown(cause);
    if (error instanceof server_1.TRPCError) {
        return cause;
    }
    const trpcError = new server_1.TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: error,
        message: error.message,
    });
    trpcError.stack = error.stack;
    return trpcError;
}
exports.getTRPCErrorFromUnknown = getTRPCErrorFromUnknown;
function getCauseFromUnknown(cause) {
    if (cause instanceof Error) {
        return cause;
    }
    return undefined;
}
exports.getCauseFromUnknown = getCauseFromUnknown;
