import type { Response } from "express"

export function safeParseInstructions(val: string | null | undefined): string[] | null {
  if (!val) return null;
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

/** Used for standard response */
export const _res = {
  error: (
    code: number,
    res: Response,
    message: string) => res.status(code).json({
    success: false,
    message
  }),
  success: (
    code: number,
    res: Response,
    message: String,
    data?: any
  ) => res.status(code).json({
      success: true,
      message,
      data
  })
}
