import styles, {Modifier, ForegroundColor} from 'ansi-styles';

type Message = string | number | boolean;

export class LoggerService {
  static whiteBright(message: Readonly<Message>): string {
    return this._format(message, 'whiteBright');
  }

  static yellowBright(message: Readonly<Message>): string {
    return this._format(message, 'yellowBright');
  }

  static magenta(message: Readonly<Message>): string {
    return this._format(message, 'magenta');
  }

  static cyan(message: Readonly<Message>): string {
    return this._format(message, 'cyan');
  }

  static yellow(message: Readonly<Message>): string {
    return this._format(message, 'yellow');
  }

  static white(message: Readonly<Message>): string {
    return this._format(message, 'white');
  }

  static green(message: Readonly<Message>): string {
    return this._format(message, 'green');
  }

  static red(message: Readonly<Message>): string {
    return this._format(message, 'red');
  }

  static blue(message: Readonly<Message>): string {
    return this._format(message, 'blue');
  }

  static bold(message: Readonly<Message>): string {
    return this._format(message, 'bold');
  }

  private static _format(
    message: Readonly<Message>,
    style: keyof Modifier | keyof ForegroundColor
  ): string {
    return `${styles[style].open}${message}${styles[style].close}`;
  }
}
