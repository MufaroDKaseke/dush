# DUSH-LOGGER

Easy, flexible, clean file logger for [node](https://nodejs.org)

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
  dush.notice('This is a notice log message');
  dush.success('This is a success log message');
  dush.warn('This is a warning log message');
  dush.error('This is an error log message');
  dush.debug('This is a debug log message');
  dush.critical('This is is critical log message');
  dush.verbose('This is a verbose log message');

```

#### dush.createLevel(level, options)

+ `level` {String}
+ `options` {Object} 
    - `color`: {String} Log level color(hex)
    * `prefix`: {String} String to be used as prefix of log message
    * `file`: {String} File path for the level

Create a new log level

```js

// Create new level named server
dush.createLevel('server', {prefix: 'SERV',color: '#28a745', file:'./logs/server.log'});

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
            + `color`: {String} Log level color(hex)
            + `prefix`: {String} String to be used as prefix of log message
            + `file`: {String} File path for the level

Set options for dush

```js
/* Below are default options
{
file: './main.log',
use_individual_files: false,
dateFormat: 'nothing-yet',
levels: {
  info: {
    color:'#ffffff',
    prefix: 'INFO',
    file: 'logs/info.log'
  },
  debug: {
    color:'#1e7e34',
    prefix: 'DEBUG',
    file: 'logs/debug.log'
  },
  verbose: {
    color:'#28a745',
    prefix: 'VERBOSE',
    file: 'logs/verbose.log'
  },
  notice: {
    color:'#007bff',
    prefix: 'NOTICE',
    file: 'logs/notice.log'
  },
  success: {
    color:'#28a745',
    prefix: 'SUCCESS',
    file: 'logs/SUCCESS.log'
  },
  warn: {
    color:'#ffc107',
    prefix: 'WARN',
    file: 'logs/warning.log'
  },
  error: {
    color:'#dc3545',
    prefix: 'ERROR',
    file: 'logs/error.log'
  },
  critical: {
    color:'#fd7e14',
    prefix: 'CRITIC',
    file: 'logs/critical.log'
  }
}*/

dush.init({
    'use_individual_files': true,
    'levels': {
        'info': {
            'prefix': 'INFORMATION' 
        },
        'debug': {
            'prefix': 'DEBUGING',
            'file': './logs/debugger.log'
        }
    }
});
```

NB : Use the configuration file instead of `dush.init` if you want to set override options across multiple files

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

**Example dush-config.json**

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