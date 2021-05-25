import styles from 'ansi-styles';

type Message = string | number | boolean;

export class LoggerService {
  static whiteBright(message: Readonly<Message>): string {
    return `${styles.whiteBright.open}${message}${styles.whiteBright.close}`;
  }

  static yellowBright(message: Readonly<Message>): string {
    return `${styles.yellowBright.open}${message}${styles.yellowBright.close}`;
  }

  static magenta(message: Readonly<Message>): string {
    return `${styles.magenta.open}${message}${styles.magenta.close}`;
  }

  static cyan(message: Readonly<Message>): string {
    return `${styles.cyan.open}${message}${styles.cyan.close}`;
  }

  static yellow(message: Readonly<Message>): string {
    return `${styles.yellow.open}${message}${styles.yellow.close}`;
  }

  static white(message: Readonly<Message>): string {
    return `${styles.white.open}${message}${styles.white.close}`;
  }

  static green(message: Readonly<Message>): string {
    return `${styles.green.open}${message}${styles.green.close}`;
  }

  static red(message: Readonly<Message>): string {
    return `${styles.red.open}${message}${styles.red.close}`;
  }

  static blue(message: Readonly<Message>): string {
    return `${styles.blue.open}${message}${styles.blue.close}`;
  }

  static bold(message: Readonly<Message>): string {
    return `${styles.bold.open}${message}${styles.bold.close}`;
  }
}
