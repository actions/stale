export interface IPullRequest {
  number: number;
  head: {
    ref: string;
    repo: {
      full_name: string;
    } | null;
  };
  draft?: boolean;
}
