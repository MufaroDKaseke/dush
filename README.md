# DUSH-LOGGER

Easy, flexible, clean log file manager for [node](https://nodejs.org)

## Installation

```console
npm i dush-logger

npm install dush-logger
```

## Documentation

### Basic Use

```js
const dush = require('dush-logger');
let myVariable = true;

// Do Something
if (myVariable) {
  dush.info('Variable `myVariable` is true');
} else {
  dush.error('Variable `myVariable` is false');
}
```

### Methods

#### dush.&lt;level&gt;(message)

+ `level` {String} The level to log a message at
+ `message` {String} The log message

Enter a new log message

 Examples

```js
  
  // Below are the default log levels
  dush.info('This is an info log message');
  dush.warning('This is a warning log message');
  dush.error('This is an error log message');
  dush.critical('This is is critical log message');
  dush.verbose('This is a verbose log message');

```

#### dush.createLevel(level, prefix, file)

+ `level` {String}
+ `prefix` {String}
+ `file` {String}

Create a new log level

```js

// Create new level named server
dush.createLevel('server', 'SERV' ,'./logs/server.log');

// Use the created level
dush.server('New log messages under the server level');

```

#### dush.clearLevel(level)

+ `level` {String}
NB : Set level to 'main' to clear the main or default log file

Deletes all the log messages previously written under the level.

```js
// Clearing the log file for the info level
dush.clearLevel('info');
```

#### dush.deleteLevel(level)

+ `level` {String}

Deletes the log level ,any further attempt to use the level will result `false` and produce a message.

```js
// Delete error level
dush.deleteLevel('error');

// Trying to log a new message using the error level will result in an error
dush.error('My new error log message');
```

#### dush.viewLog(level)

+ `level` {String}

Outputs previously written log messages to the console and returns the messages as an array

```js

dush.viewLog('critical');
```

#### dush.init(options)

+ `options` {Object} 
    * `file`: {String} Set path for default log file
    * `use_individual_files`: {Boolean} `true` | `false`  Set to true to write in level's independent files
    * `levels`: {Object} A showing level configurations including new levels
        - `<level>` {Object} Level configuration 
            + `prefix` : {String} String to be used as prefix of log message
            + `file` : {String} File path for the level

Set options for dush

```js
/* Below are default options
{
  file: './main.log',
  use_individual_files: false,
  dateFormat: 'nothing-yet',
  levels: {
    info: {
      prefix: 'INFO',
      file: 'logs/info.log'
    },
    warning: {
      prefix: 'WARN',
      file: 'logs/warning.log'
    },
    error: {
      prefix: 'ERROR',
      file: 'logs/error.log'
    },
    critical: {
      prefix: 'CRITIC',
      file: 'logs/critical.log'
    },
    verbose: {
      prefix: 'VERBOSE',
      file: 'logs/verbose.log'
    }
  }
}*/

dush.init({
    'use_individual_files': true,
    'levels': {
        'info': {
            'prefix': 'INFORMATION' 
        },
        'debug': {
            'prefix': 'DEBUG',
            'file': './logs/debug.log'
        }
    }
});
```

NB : Use the configuration file instead of `dush.init` if ou want to set override options across files

#### dush.setLogFile(level, file)

+ `level` {String}
+ `file` {String(path)}

Set the log file to be used for the level

```js

dush.setLogFile('info', './logs/info.log');

dush.info('New info log message');

// The above log message will be written in the file ./logs/info.log instead of the default log file

```

## Configuration File

Dush allows you to override default options using the dush configuration file. You simply create a `dush-config.json` file in the directory containing your node app file.

// Example dush-config.json
```json
{
  "use_individual_files": true,
  "levels": {
    "info": {
        "prefix": "INFORMATION"
    },
    "debug": {
        "prefix": "DEBUG",
        "file": "./logs/debug.log"
    }
  }
}

```

NB : For now dush still has only a few options