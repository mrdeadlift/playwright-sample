import { pathToFileURL } from 'url';
import path from 'path';

export function fileUrl(relPathFromRepoRoot: string): string {
  const absolute = path.resolve(__dirname, '..', relPathFromRepoRoot);
  return pathToFileURL(absolute).href;
}
