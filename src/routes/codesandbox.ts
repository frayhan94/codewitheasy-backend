import { Hono } from 'hono';

const codesandbox = new Hono();

function createCodeSandboxDefineUrl(
  files: Record<string, { content: string }>,
  template: string = 'react'
) {
  const parameters = { files, template };
  const encoded = Buffer.from(JSON.stringify(parameters))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const baseUrl = 'https://codesandbox.io/api/v1/sandboxes/define';

  return {
    sandboxId: encoded,
    sandboxUrl: `${baseUrl}?parameters=${encoded}`,
    editorUrl: `${baseUrl}?parameters=${encoded}`,
    embedUrl: `${baseUrl}?parameters=${encoded}&embed=1`,
  };
}

codesandbox.post('/create', async (c) => {
  try {
    const body = await c.req.json();
    const { code, language = 'javascript', title = 'Code Playground' } = body;

    if (typeof code !== 'string' || !code.trim()) {
      return c.json({ success: false, error: 'Code must be a non-empty string' }, 400);
    }

    const safeTitle = String(title).toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 50) || 'playground';
    let files: Record<string, { content: string }> = {};
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
      // Logic untuk JS, HTML, CSS tetep pake template static
      template = 'static';
      if (language === 'html') {
        files = { 'index.html': { content: code } };
      } else if (language === 'css') {
        files = { 'index.html': { content: `<!DOCTYPE html><html><head><style>${code}</style></head><body><div id="app"><h1>CSS Preview</h1></div></body></html>` } };
      } else {
        files = { 'index.html': { content: `<!DOCTYPE html><html><body><script>${code}</script><h1>Check Console</h1></body></html>` } };
      }
    }

    const result = createCodeSandboxDefineUrl(files, template);
    return c.json({ success: true, data: result });
  } catch (err) {
    return c.json({ success: false, error: 'Failed to create sandbox' }, 500);
  }
});

export default codesandbox;