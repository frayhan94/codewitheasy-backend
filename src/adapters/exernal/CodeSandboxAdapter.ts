import { ICodeSandboxRepository } from '../../core/ports/ICodeSandboxRepository';
import { CodeSandboxFiles, CodeSandboxResult } from '../../core/entities/CodeSandbox';

export class CodeSandboxAdapter implements ICodeSandboxRepository {
  createDefineUrl(files: CodeSandboxFiles, template: string): CodeSandboxResult {
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
}