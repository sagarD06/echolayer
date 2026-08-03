import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
    collapsed: boolean;
    toggle: () => void;
    setCollapsed: (val: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()(
    persist(
        (set) => ({
            collapsed: false,
            toggle: () => set((s) => ({ collapsed: !s.collapsed })),
            setCollapsed: (val) => set({ collapsed: val }),
        }),
        { name: "sidebar-state" }
    )
);