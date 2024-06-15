export type CustomModalData = {
  cancelButton?: {
    action?: () => void,
    text?: string,
  },
  confirmButton?: {
    action: () => void,
    text?: string,
  },
  header: string,
  message: string,
};