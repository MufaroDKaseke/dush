
const fs = require('fs');
const path = require('path');

class Dush {
  constructor() {
    this.pref = {
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
      let prefix = this.pref.levels[level].prefix;
      let file = this.pref.levels[level].file;
      this.createLevel(name ,prefix ,file);
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

    let configFile = 'playground.json';
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
    return catergory.toUpperCase();
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

createLevel(name ,prefix ,file) {
  if (name !== undefined) {
    let levelPrefix = (prefix !== undefined) ? prefix : name.toUpperCase();
    let levelFile = (file !== undefined) ? file : `./logs/${name}.log`;
    this.pref.levels[name] = {
      prefix : `${levelPrefix}`,
      file : `${levelFile}`
    };

    this[name] = function(message) {
      const logTime = this.getCurrentTime;
      const prefix = this.getPrefix(name);
      const data = `${logTime} [${prefix}] ${message}\n`;
      const fileToLog = this.getLogFile(name);
      fs.appendFile(fileToLog, data, 'utf8', (err) => {
        if (err) throw err;
          //console.log(`New ${name} log message recorded at ${fileToLog}`);
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