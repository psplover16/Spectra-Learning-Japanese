export interface ToastState {
  visible: boolean;
  kind: 'success' | 'warning';
  message: string;
  actionLabel: string | null;
}
