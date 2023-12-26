import {
    AnyRouter,
    ProcedureType,
    TRPCError
} from '@trpc/server'
import {
    TRPCResponse,
    TRPCResponseMessage
} from '@trpc/server/rpc'

export function transformTRPCResponseItem<
    TResponseItem extends TRPCResponse | TRPCResponseMessage
>(router: AnyRouter, item: TResponseItem): TResponseItem {
    if ('error' in item) {
        return {
            ...item,
            error: router._def._config.transformer.output.serialize(item.error)
        }
    }

    if ('data' in item.result) {
        return {
            ...item,
            result: {
                ...item.result,
                data: router._def._config.transformer.output.serialize(
                    item.result.data
                )
            }
        }
    }

    return item
}

export function transformTRPCResponse<
    TResponse extends
        | TRPCResponse
        | TRPCResponse[]
        | TRPCResponseMessage
        | TRPCResponseMessage[]
>(router: AnyRouter, itemOrItems: TResponse) {
    return Array.isArray(itemOrItems)
        ? itemOrItems.map((item) => transformTRPCResponseItem(router, item))
        : transformTRPCResponseItem(router, itemOrItems)
}

export function getMessageFromUnknownError(
    err: unknown,
    fallback: string
): string {
    if (typeof err === 'string') {
        return err
    }

    if (err instanceof Error && typeof err.message === 'string') {
        return err.message
    }
    return fallback
}

export function getErrorFromUnknown(cause: unknown): Error {
    if (cause instanceof Error) {
        return cause
    }
    const message = getMessageFromUnknownError(cause, 'Unknown error')
    return new Error(message)
}

export function getTRPCErrorFromUnknown(cause: unknown): TRPCError {
    const error = getErrorFromUnknown(cause)
    if (error instanceof TRPCError) {
      return cause as TRPCError
    }

    const trpcError = new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        cause: error,
        message: error.message
    })

    // Inherit stack from error
    trpcError.stack = error.stack

    return trpcError
}

export function getCauseFromUnknown(cause: unknown) {
    if (cause instanceof Error) {
        return cause
    }
    return undefined
}
