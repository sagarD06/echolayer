"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "@/services/base.api";

function makeStore() {
    return configureStore({
        reducer: {
            [baseApi.reducerPath]: baseApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(baseApi.middleware),
    });
}

type AppStore = ReturnType<typeof makeStore>;

let storeInstance: AppStore | null = null;

function getStore() {
    if (!storeInstance) {
        storeInstance = makeStore();
    }
    return storeInstance;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
    const storeRef = useRef<AppStore | null>(null);
    if (!storeRef.current) {
        storeRef.current = getStore();
    }

    return <Provider store={storeRef.current}>{children}</Provider>;
}