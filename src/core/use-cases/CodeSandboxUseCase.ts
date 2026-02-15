import { ICodeSandboxRepository } from '../ports/ICodeSandboxRepository';
import { CodeSandboxRequest, CodeSandboxFiles } from '../entities/CodeSandbox';

export class CodeSandboxUseCase {
  constructor(private codeSandboxRepository: ICodeSandboxRepository) {}

  async create(request: CodeSandboxRequest) {
    const { code, language = 'javascript', title = 'Code Playground' } = request;

    if (typeof code !== 'string' || !code.trim()) {
      throw new Error('Code must be a non-empty string');
    }

    const safeTitle = String(title).toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 50) || 'playground';
    let files: CodeSandboxFiles = {};
    let template: string = 'static';

    if (language === 'react') {
      template = 'react';
      files = {
        'package.json': {
          content: JSON.stringify({
            name: safeTitle,
            dependencies: {
              react: "^18.2.0",
              "react-dom": "^18.2.0",
              "react-scripts": "^5.0.1"
            }
          })
        },
        'src/App.js': { content: code },
        'src/index.js': {
          content: `import React from "react";\nimport { createRoot } from "react-dom/client";\nimport App from "./App";\n\nconst root = createRoot(document.getElementById("root"));\nroot.render(<App />);`
        },
        'public/index.html': {
          content: `<!DOCTYPE html><html><body><div id="root"></div></body></html>`
        }
      };
    } 
    else if (language === 'typescript') {
      template = 'vanilla-ts'; 
      files = {
        'package.json': {
          content: JSON.stringify({
            name: safeTitle,
            main: "index.ts",
            dependencies: { "typescript": "^5.0.0" }
          })
        },
        'index.ts': { content: code },
        'index.html': {
          content: `<!DOCTYPE html><html><body><div id="app"></div><script src="index.ts"></script></body></html>`
        }
      };
    }
    else {
      // Default to static template for JS, HTML, and CSS
      template = 'static';
      if (language === 'html') {
        files = { 'index.html': { content: code } };
      } else if (language === 'css') {
        files = { 'index.html': { content: `<!DOCTYPE html><html><head><style>${code}</style></head><body><div id="app"><h1>CSS Preview</h1></div></body></html>` } };
      } else {
        files = { 'index.html': { content: `<!DOCTYPE html><html><body><script>${code}</script><h1>Check Console</h1></body></html>` } };
      }
    }

    const result = this.codeSandboxRepository.createDefineUrl(files, template);
    return { success: true, data: result };
  }
}