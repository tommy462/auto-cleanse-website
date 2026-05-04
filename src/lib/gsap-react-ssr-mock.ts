import { useEffect } from 'react';

export const useGSAP = (fn: () => void | (() => void), deps?: unknown[]) => {
  useEffect(() => {}, deps ?? []);
};

export const GSAPContext = () => null;
