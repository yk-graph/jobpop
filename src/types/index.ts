export type ServerActionResult<T> =
  | { success: true; message: string; data: T }
  | { success: false; message: string; data?: never };
