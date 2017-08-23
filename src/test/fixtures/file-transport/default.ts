
// created as a TypeScript file, since this is needed in the build directory.
// This way TypeScript compiles & emits it into the proper final destination.
module.exports = {
  'winston': {
    'transports': [{
      'type': 'File',
      'name': 'File_info',
      'colorize': true,
      'showLevel': true,
      'json': true,
      'stringify': true,
      'timestamp': true,
      'level': 'info',
      // custom directory used to test directory autocreation (winston-cfg does this)
      // winston maintainers are refusing to do this:
      // https://github.com/winstonjs/winston/issues/579
      'filename': 'logs/test-file-transport/app-info.log',
    }],
    'level': 'info',
    'loggers': [{
      'id': 'app',
      'level': 'debug'
    }, {
      'id': 'app2',
      'level': 'info'
    }]
  }
};
