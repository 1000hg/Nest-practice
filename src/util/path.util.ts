import { join } from 'path';

export class PathUtil {
  public GetFilePath(page: string): string {
    return join(__dirname, '..', '..', 'public', 'page', `${page}.html`);
  }
}
