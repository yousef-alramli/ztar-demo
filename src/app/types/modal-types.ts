export type ErrorModalData = {
    confirmButton?: {
      action: () => void,
      text?: string,
    }
    header: string,
    message: string,
  };