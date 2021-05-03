import chalk from 'chalk';

// Disabled the colors to:
// - improve the performances
// - avoid to mock chalk
// - avoid to have failing tests when testing the logs due to the extra text the log message will contains
//
// Note:
// If you need to debug the log colours you can remove this line temporarily
// But some tests will fail
chalk.level = 0;
