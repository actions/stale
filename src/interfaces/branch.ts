import {IsoDateString} from '../types/iso-date-string.js';

export interface IBranch {
  name: string;
  lastCommitDate: IsoDateString;
  prClosedAt: IsoDateString | null; // Most recently closed PR from this branch, null if it never had one
  hasOpenPr: boolean; // Head or base of an open PR
  isProtected: boolean; // Default branch, classic branch protection or a ruleset blocking deletion
}
