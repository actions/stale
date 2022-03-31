export interface IPullRequest {
  number: number;
  head: {
    ref: string;
  };
  draft?: boolean;
}
