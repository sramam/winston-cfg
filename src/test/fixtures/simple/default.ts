
// created as a TypeScript file, since this is needed in the build directory.
// This way TypeScript compiles & emits it into the proper final destination.
module.exports = {
  'winston': {
    'transports': [{
      'type': 'Console',
      'label': 'def'
    }],
    'level': 'info',
    'loggers': [{
      'id': 'app',
      'level': 'debug',
      'transports': [{
        'type': 'Console',
        'label': 'app'
      }]
    }, {
      'id': 'app2',
      'level': 'info'
    }]
  }
};
