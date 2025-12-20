import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: 'USER' | 'VENDOR' | 'ADMIN';
    avatar?: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    hasHydrated: boolean;
    setHasHydrated: (hydrated: boolean) => void;
    login: (user: User) => void;
    logout: () => void;
    updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isAuthenticated: false,
            hasHydrated: false,
            setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
            login: (user) => set({ user, isAuthenticated: true }),
            logout: () =>
                set({ user: null, isAuthenticated: false }),
            updateUser: (updates) =>
                set((state) => ({
                    user: state.user ? { ...state.user, ...updates } : null,
                })),
        }),
        {
            name: 'aura-auth-storage',
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
