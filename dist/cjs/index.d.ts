/// <reference types="bun-types" />
import { Elysia } from "elysia";
import { Router } from "@trpc/core";
import type { TSchema } from "@sinclair/typebox";
import type { TRPCOptions } from "./types";
export declare function compile<T extends TSchema>(schema: T): (value: unknown) => unknown;
export declare const trpc: (router: Router<any>, { endpoint, ...options }?: TRPCOptions) => (eri: Elysia) => Elysia<"", {
    request: {};
    store: {};
    derive: {};
    resolve: {};
}, {
    type: {};
    error: {};
}, {}, {}, {
    [x: `${string}/*`]: {
        get: {
            body: unknown;
            params: Record<"*", string>;
            query: unknown;
            headers: unknown;
            response: {
                200: Promise<Response>;
            };
        };
    } & {
        post: {
            body: unknown;
            params: Record<"*", string>;
            query: unknown;
            headers: unknown;
            response: {
                200: Promise<Response>;
            };
        };
    };
}, false>;
export type { TRPCClientIncomingRequest, TRPCOptions } from "./types";
