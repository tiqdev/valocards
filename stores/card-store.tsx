"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createStore, useStore, type StoreApi } from "zustand";
import { serializeCardConfig, type CardConfig } from "@/lib/card/config";
import { LANGUAGE_COOKIE } from "@/lib/i18n";

export const EDITOR_TABS = ["player", "card", "agent", "rank", "title"] as const;
export type EditorTab = (typeof EDITOR_TABS)[number];

interface CardState {
  config: CardConfig;
  activeTab: EditorTab;

  update: (patch: Partial<CardConfig>) => void;
  replace: (config: CardConfig) => void;
  setActiveTab: (tab: EditorTab) => void;
}

const createCardStore = (initialConfig: CardConfig) =>
  createStore<CardState>()((set) => ({
    config: initialConfig,
    activeTab: "player",

    update: (patch) => set((state) => ({ config: { ...state.config, ...patch } })),
    replace: (config) => set({ config }),
    setActiveTab: (activeTab) => set({ activeTab }),
  }));

const CardStoreContext = createContext<StoreApi<CardState> | null>(null);

const URL_SYNC_DELAY = 250;

/**
 * Kart ayarları sunucuda URL'den okunur ve store bu değerle başlar; böylece
 * ilk render'da sunucu ile istemci aynı kartı çizer. Sonraki değişiklikler
 * paylaşılabilir olması için URL'ye geri yazılır.
 */
export const CardStoreProvider = ({
  initialConfig,
  children,
}: {
  initialConfig: CardConfig;
  children: React.ReactNode;
}) => {
  const [store] = useState(() => createCardStore(initialConfig));

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    const unsubscribe = store.subscribe((state, previous) => {
      if (state.config === previous.config) return;

      clearTimeout(timer);
      timer = setTimeout(() => {
        window.history.replaceState(
          null,
          "",
          `?${serializeCardConfig(store.getState().config)}`
        );
      }, URL_SYNC_DELAY);

      if (state.config.lang !== previous.config.lang) {
        document.cookie = `${LANGUAGE_COOKIE}=${state.config.lang}; path=/; max-age=31536000; samesite=lax`;
      }
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, [store]);

  return (
    <CardStoreContext.Provider value={store}>
      {children}
    </CardStoreContext.Provider>
  );
};

export const useCardStore = <T,>(selector: (state: CardState) => T): T => {
  const store = useContext(CardStoreContext);
  if (!store) {
    throw new Error("useCardStore must be used within CardStoreProvider");
  }
  return useStore(store, selector);
};

/** Store'un anlık değerine render dışında (event handler'larda) erişim için. */
export const useCardStoreApi = () => {
  const store = useContext(CardStoreContext);
  if (!store) {
    throw new Error("useCardStoreApi must be used within CardStoreProvider");
  }
  return store;
};
