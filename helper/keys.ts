import { SHORT_CUTS } from "../global/var";

export function shortKey(pressedKeys: Set<string>): boolean { 
  return SHORT_CUTS.some((subArray: string[]) => { 
    const subArraySet = new Set(subArray);
    return [...subArraySet].every((item) => pressedKeys.has(item));
  });
}