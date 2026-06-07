import { ButtonHTMLAttributes, ReactNode } from 'react';
import './LoadingButton.scss';

export interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
}

export function LoadingButton({
  loading = false,
  loadingText,
  children,
  disabled,
  ...rest
}: LoadingButtonProps) {
  return (
    <button disabled={loading || disabled} aria-busy={loading} {...rest}>
      {loading && <span className="m2s2-btn-spinner" aria-hidden="true" />}
      {loading && loadingText ? loadingText : children}
    </button>
  );
}
