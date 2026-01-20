/**
 * Tooltip.tsx - Reusable Tooltip Component
 * 
 * Portal-based tooltip that renders to document.body to avoid
 * overflow and z-index issues. Supports four positions: top, bottom,
 * left, right. Calculates position dynamically based on trigger element.
 */

import { ReactNode, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  children: ReactNode;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ children, text, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const tooltipOffset = 8;
      
      let top = 0;
      let left = 0;
      
      switch (position) {
        case 'top':
          top = rect.top - tooltipOffset;
          left = rect.left + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + tooltipOffset;
          left = rect.left + rect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - tooltipOffset;
          break;
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + tooltipOffset;
          break;
      }
      
      setCoords({ top, left });
    }
  }, [isVisible, position]);
  
  const getTooltipStyle = (): React.CSSProperties => {
    switch (position) {
      case 'top':
        return {
          position: 'fixed',
          top: coords.top,
          left: coords.left,
          transform: 'translate(-50%, -100%)',
        };
      case 'bottom':
        return {
          position: 'fixed',
          top: coords.top,
          left: coords.left,
          transform: 'translate(-50%, 0)',
        };
      case 'left':
        return {
          position: 'fixed',
          top: coords.top,
          left: coords.left,
          transform: 'translate(-100%, -50%)',
        };
      case 'right':
        return {
          position: 'fixed',
          top: coords.top,
          left: coords.left,
          transform: 'translate(0, -50%)',
        };
    }
  };
  
  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-dark-600',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-dark-600',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-dark-600',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-dark-600',
  };
  
  return (
    <>
      <div 
        ref={triggerRef}
        className="inline-flex"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && createPortal(
        <div 
          style={getTooltipStyle()}
          className="z-[9999] px-2.5 py-1.5 text-xs font-medium text-white bg-dark-600 rounded-md shadow-lg whitespace-nowrap pointer-events-none"
        >
          {text}
          <div 
            className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
          />
        </div>,
        document.body
      )}
    </>
  );
}
