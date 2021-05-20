const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class Dush {
  constructor() {
    this.pref = {
      file: './main.log',
      config: 'dush-config.json',
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
          prefix: 'INFO',
          file: 'logs/info.log'
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
      }
    };

    this.getConfigFile();

  }

  init(options) {
    this.bindConfig(options);
    return this.setLevels();   
  }

  setLevels() {
    // Create Methods
    for (const level in this.pref.levels) {
      let name = level;
      let options = this.pref.levels[name];
      this.createLevel(name ,options);
    }
    return true;
  }

  bindConfig(config) {
    if (Object.prototype.hasOwnProperty.call(config, 'levels')) {
      for (const level in config.levels) {

        if (Object.prototype.hasOwnProperty.call(this.pref.levels, level)) {
          for (const criteria in config.levels[level]) {
            this.pref.levels[level][criteria] = config.levels[level][criteria];
          }
        } else {
          this.pref.levels[level] = config.levels[level];
        }
      }
    }

    delete config.levels;

    for (const option in config) {
      this.pref[option] = config[option];
    }

    return this.pref;
  }

  getConfigFile() {

    let configFile = this.pref.config;
    let config;

    let files = fs.readdirSync('./');

    if (files.includes(configFile)) {
      let data = fs.readFileSync(configFile, { encoding:'utf8' ,flag:'r'});
      config = JSON.parse(data);
      this.init(config);
    } else {
      this.setLevels();
    }
  }

  setLogFile(level ,file) {
    if (level !== undefined && level !== '') {
      if (file !== undefined && file !== '') {
        if (Object.prototype.hasOwnProperty.call(this.pref.levels, level)) {  
          this.pref.levels[level].file = file;
        } else if (level === 'main') {
          this.pref.file = file;
        } else {
          console.error(`Error : Level doesn't exist`);
        }
      } else {
        console.error('Error : File not specified');
      } 
      
    } else {
      console.error('Error : Level not specified');
    }
  }


  // Module System Methods

  get getCurrentTime() {
    let date = new Date();

    // Date
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    year = String(year);
    year = year.split('').reverse().join('');
    year = year.charAt(1) + year.charAt(0);

    // Time
    let hour = (date.getHours() >= 10) ? date.getHours() : '0' + date.getHours();
    let minutes = (date.getMinutes() >= 10) ? date.getMinutes() : '0' + date.getMinutes();
    let seconds = (date.getSeconds() >= 10) ? date.getSeconds() : '0' + date.getSeconds();


    let currentTime = '[' + month + '/' + day + '/' + year + ', ' + hour + ':' + minutes + ':' + seconds + ']';

    return currentTime;
  }

  rectFile(file) {
    let dir = path.dirname(file);
    fs.mkdirSync(dir, {recursive:true});
    return true;
  }

  getLogFile(level) {
    let logFile;
    if (this.pref.use_individual_files) {
      logFile = this.pref.levels[level].file;
      if(this.rectFile(logFile)) {
        return logFile;
      }
    } else {
      logFile = this.pref.file;
      if(this.rectFile(logFile)) {
        return logFile;
      }
    }
  }

  getPrefix(level) {
    if (this.pref.levels[level].prefix !== ``) {
      return this.pref.levels[level].prefix;
    } else {
      return level.toUpperCase();
    }
  }

  viewLog(level) {
    let preLogMsg;
    let logToView;
    if(level !== undefined && level !== '') {
      if(this.pref.levels[level].file !== undefined && this.pref.levels[level].file !== '') {
        logToView = this.pref.levels[level].file;
        preLogMsg = `Reading Log File \nFileType : Individual Log\nFileName : ${logToView}\n\n==============================START==============================\n`;
      } else {
        console.error('Error : Category file is empty or category does not exist!!!');
      }

    } else {
      logToView = this.pref.file;
      preLogMsg = `Reading Log File \nFileType : Main Log\nFileName : ${logToView}\n\n==============================START==============================\n`;
    }
    var postLogMsg = '\n==============================End================================';
    fs.readFile(logToView, 'utf8', (err, data) => {
      if (err) throw err;
      console.log(`${preLogMsg}${data}${postLogMsg}`);
    });
  }

  printMsg(level ,message) {
    let color = this.pref.levels[level].color;
    console.log(chalk.hex(color).bold(level) + ` : ${message}`);
  }

  createLevel(name ,options) {
    if (name !== undefined) {
      let levelPrefix = (options.prefix !== undefined) ? options.prefix : name.toUpperCase();
      let levelFile = (options.file !== undefined) ? options.file : `./logs/${name}.log`;
      let levelColor = (options.color !== undefined) ? options.color : '';
      this.pref.levels[name] = {
        color : `${levelColor}`,
        prefix : `${levelPrefix}`,
        file : `${levelFile}`,
      };

      this[name] = function(message) {
        const logTime = this.getCurrentTime;
        const prefix = this.getPrefix(name);
        const data = `${logTime} [${prefix}] ${message}\n`;
        const fileToLog = this.getLogFile(name);
        fs.appendFile(fileToLog, data, 'utf8', (err) => {
          if (err) {
            throw err;
          } else {
            this.printMsg(`${name}` ,message);
          }
        });
      };
    }
  }


  clearLevel(level) {
    let fileToClear;
    if (Object.prototype.hasOwnProperty.call(this.pref.levels, level)) {
      fileToClear = this.pref.levels[level].file;
    } else if (level === 'main') {
      fileToClear = this.pref.file;
    } else {
      console.error(`Error : Level doesn't exist`);
    }

    fs.writeFile(fileToClear, '', 'utf8', (err) => {
      if (err) throw err;
      console.log(`Cleared log level : '${level}'`);
    });
  }

  deleteLevel(level) {
    delete this.pref.levels[level];
    this[level] = function () {
      console.warn(`Sorry!!! You can't use level '${level}', it was deleted\nuse dush.createLevel('${level}') to create it again`);
    };
  }
}

module.exports = new Dush();