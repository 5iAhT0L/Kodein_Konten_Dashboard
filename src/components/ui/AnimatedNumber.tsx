'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface AnimatedNumberProps {
  value: number | null | undefined;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  fallback?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  className = '',
  fallback = '—'
}) => {
  const [displayValue, setDisplayValue] = useState<string>(fallback);
  const prevValueRef = useRef<number>(0);
  const objRef = useRef<{ val: number }>({ val: 0 });

  useEffect(() => {
    if (value === null || value === undefined || isNaN(value)) {
      setDisplayValue(fallback);
      return;
    }

    // Check reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayValue(
        `${prefix}${value.toLocaleString('id-ID', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        })}${suffix}`
      );
      prevValueRef.current = value;
      return;
    }

    objRef.current.val = prevValueRef.current;

    const tween = gsap.to(objRef.current, {
      val: value,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplayValue(
          `${prefix}${objRef.current.val.toLocaleString('id-ID', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
          })}${suffix}`
        );
      },
      onComplete: () => {
        prevValueRef.current = value;
      }
    });

    return () => {
      tween.kill();
    };
  }, [value, decimals, prefix, suffix, fallback]);

  return <span className={className}>{displayValue}</span>;
};
