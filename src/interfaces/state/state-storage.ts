export interface IStateStorage {
  save(serializedState: string): Promise<void>;
  restore(): Promise<string>;
}
