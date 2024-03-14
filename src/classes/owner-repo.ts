import {IOwnerRepo} from '../interfaces/owner-repo';

export class OwnerRepo implements IOwnerRepo {
  readonly owner: string;
  readonly repo: string;

  constructor(repo_url: string) {
    const m = repo_url.match(/.*\/([^/]+)\/(.+)$/);
    if (!m) {
      this.owner = '';
      this.repo = '';
    } else {
      this.owner = m[1];
      this.repo = m[2];
    }
  }
}
