import { createContext, useContext } from 'react';

/** Nodo dentro del marco del teléfono donde se montan hojas y avisos. */
export const OverlayContext = createContext<HTMLElement | null>(null);

export const useOverlayRoot = () => useContext(OverlayContext);
