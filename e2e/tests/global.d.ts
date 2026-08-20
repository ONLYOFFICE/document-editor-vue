export {};

declare global {
  interface Window {
    __e2eEvents__?: string[];
    __e2eErrors__?: Array<{ errorCode: number; errorDescription: string }>;
    DocEditor?: { instances: Record<string, unknown> };
  }
}
