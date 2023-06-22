import {IState} from '../interfaces/state';
import {State} from '../classes/state';

export class StateService {
  static getState(): IState {
    return new State();
  }
}
