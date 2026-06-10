import { ReactNode, useEffect, useRef, useState } from 'react';
import type { AnchorDropdownItem, ClickableDropdownItem, DropdownItem } from '@m2s2/models';
import './Dropdown.scss';

type DropdownItemConfig = DropdownItem & (
  | Pick<AnchorDropdownItem, 'href'>
  | Pick<ClickableDropdownItem, 'onClick'>
  | Record<string, never>
);

export interface DropdownProps {
  trigger: ReactNode;
  items:   DropdownItemConfig[];
  align?:  'left' | 'right';
}

function isAnchor(item: DropdownItemConfig): item is DropdownItem & Pick<AnchorDropdownItem, 'href'> {
  return 'href' in item;
}

function isClickable(item: DropdownItemConfig): item is DropdownItem & Pick<ClickableDropdownItem, 'onClick'> {
  return 'onClick' in item;
}

export function Dropdown({ trigger, items, align = 'left' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  return (
    <div className="m2s2-dropdown" ref={ref}>
      <div
        className="m2s2-dropdown__trigger"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={open}>
        {trigger}
      </div>

      {open && (
        <ul
          className={`m2s2-dropdown__menu m2s2-dropdown__menu--${align}`}
          role="menu">
          {items.map(item => (
            <li key={item.id} className="m2s2-dropdown__item" role="none">
              {isAnchor(item) ? (
                <a
                  href={(item as AnchorDropdownItem).href}
                  className="m2s2-dropdown__link"
                  role="menuitem"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}>
                  {item.imgSrc && <img src={item.imgSrc} alt="" aria-hidden="true" />}
                  {item.text}
                </a>
              ) : isClickable(item) ? (
                <button
                  className="m2s2-dropdown__link"
                  role="menuitem"
                  onClick={() => { (item as ClickableDropdownItem).onClick(); setOpen(false); }}>
                  {item.imgSrc && <img src={item.imgSrc} alt="" aria-hidden="true" />}
                  {item.text}
                </button>
              ) : (
                <span className="m2s2-dropdown__link m2s2-dropdown__link--disabled" role="menuitem" aria-disabled="true">
                  {item.imgSrc && <img src={item.imgSrc} alt="" aria-hidden="true" />}
                  {item.text}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
