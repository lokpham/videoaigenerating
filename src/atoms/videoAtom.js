
import { atom } from "jotai";

export const videosAtom = atom([]);
export const videosLoadingAtom = atom(false);
export const totalPagesAtom = atom(1);

export const searchTermAtom = atom("");
export const currentPageAtom = atom(1);
export const startDateAtom = atom("");
export const endDateAtom = atom("");