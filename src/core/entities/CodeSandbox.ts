export interface CodeSandboxRequest {
  code: string;
  language?: string;
  title?: string;
}

export interface CodeSandboxResult {
  sandboxId: string;
  sandboxUrl: string;
  editorUrl: string;
  embedUrl: string;
}

export interface CodeSandboxFiles {
  [key: string]: {
    content: string;
  };
}