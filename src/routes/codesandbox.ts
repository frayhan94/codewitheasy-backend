import { Hono } from 'hono';

const codesandbox = new Hono();

function createCodeSandboxDefineUrl(
  files: Record<string, string>,
  template: 'react' | 'static' = 'react'
) {
  const sandboxFiles: Record<string, { content: string }> = {};

  for (const [path, content] of Object.entries(files)) {
    sandboxFiles[path] = { content };
  }

  const parameters = { files: sandboxFiles, template };

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
      return c.json(
        { success: false, error: 'Code must be a non-empty string' },
        400
      );
    }

    const safeTitle =
      String(title).toLowerCase().replace(/[^a-z0-9-]/g, '-').slice(0, 50) ||
      'playground';

    let files: Record<string, string> = {};
    let template: 'react' | 'static' = 'static';

    // 🔒 REACT — FAIL FAST
    if (language === 'react') {
      const hasDefaultAppExport =
        /export\s+default\s+(function\s+App|App)/.test(code);

      if (!hasDefaultAppExport) {
        return c.json(
          {
            success: false,
            error:
              'React code must export a default App component.\n\nExample:\nexport default function App() {\n  return <div>Hello React</div>;\n}',
          },
          400
        );
      }

      template = 'react';

      files = {
        'package.json': JSON.stringify(
          {
            name: safeTitle,
            private: true,
            dependencies: {
              react: '^18.2.0',
              'react-dom': '^18.2.0',
            },
          },
          null,
          2
        ),

        'public/index.html': `<!DOCTYPE html>
<html>
  <body>
    <div id="root"></div>
  </body>
</html>`,

        'src/index.js': `
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(<App />);
`,

        'src/App.js': code,
      };
    }

    // HTML
    else if (language === 'html') {
      template = 'static';
      files = { 'index.html': code };
    }

    // CSS
    else if (language === 'css') {
      template = 'static';
      files = {
        'index.html': `<!DOCTYPE html>
<html>
  <head>
    <style>${code}</style>
  </head>
  <body>
    <button class="btn">Button</button>
    <div class="card">Card</div>
  </body>
</html>`,
      };
    }

    // JavaScript
    else {
      template = 'static';
      files = {
        'index.html': `<!DOCTYPE html>
<html>
  <body>
    <script>
${code}
    </script>
  </body>
</html>`,
      };
    }

    const result = createCodeSandboxDefineUrl(files, template);

    return c.json({ success: true, data: result });
  } catch (err) {
    console.error('[CodeSandbox Error]', err);
    return c.json(
      { success: false, error: 'Failed to create sandbox' },
      500
    );
  }
});

export default codesandbox;
