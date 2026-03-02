import { CodeSandboxFiles, CodeSandboxResult } from '../entities/CodeSandbox';

export interface ICodeSandboxRepository {
  createDefineUrl(files: CodeSandboxFiles, template: string): CodeSandboxResult;
}