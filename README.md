# winston-cfg

<!-- badge -->
[![npm license](https://img.shields.io/npm/l/winston-cfg.svg)](https://www.npmjs.com/package/winston-cfg)
[![travis status](https://img.shields.io/travis/sramam/winston-cfg.svg)](https://travis-ci.org/sramam/winston-cfg)
[![Build status](https://ci.appveyor.com/api/projects/status/g7ev07vefgqxl70x?svg=true)](https://ci.appveyor.com/project/sramam/winston-cfg)
[![Coverage Status](https://coveralls.io/repos/github/sramam/winston-cfg/badge.svg?branch=master)](https://coveralls.io/github/sramam/winston-cfg?branch=master)
[![David](https://david-dm.org/sramam/winston-cfg/status.svg)](https://david-dm.org/sramam/winston-cfg)
[![David](https://david-dm.org/sramam/winston-cfg/dev-status.svg)](https://david-dm.org/sramam/winston-cfg?type=dev)
<br/>
[![NPM](https://nodei.co/npm/winston-cfg.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/winston-cfg/)
<!-- endbadge -->

A simple utility that enables [winston](https://github.com/winstonjs/winston) configuration via [node-config](https://github.com/lorenwest/node-config)

## Usage

### A brief introduction to winston internals

For most common use cases, there are three things that one needs to configure with winston:

1. _transports_: the destination(s) for the logs. Winston provides a few out of the box. Transports with external dependencies,  with external dependencies are supported as 3rd party modules. Depending on the actual transport, some have pretty involved configuration.
1. _loggers_: an ability to segment logging capability, for example by application layer (app, http, db etc). Each logger can have multiple transports - either the global or a custom set.
1. _default logger_: `winston` instantiate a default logger that is configured with a 'Console' transport and set to 'info' level. This can be configured in exactly the same manner as any logger.

```bash
                 +-------------------------------------------+
                 |            winston configuration          |
+-------------+  |                                           |
| APPLICATION    |       +----------+                        |
|             |  |  +--> | Default  +--+                     |
|             |  |  |    +----------+  |                     |
| +---------+ |  |  |    +----------+  |   +-------------+   |
| | Layer 1 +----------> | Logger 1 +-+--> | Transport A +--------->
| +---------+ |  |       +----------+ |    +-------------+   |
|     ...     |  |                    |                      |
| +---------+ |  |       +----------+ +--> +-------------+   |
| | Layer N +----------> | Logger 1 +----> | Transport B +--------->
| +---------+ |  |       +----------+      +-------------+   |
+-------------+  |                                           |
                 |                                           |
                 +-------------------------------------------+

```

### Simple Configuraton

Please see the interface definition in [src/index.ts:Config](https://github.com/sramam/winston-cfg/blob/master/src/index.ts#L10) for details
on valid config settings.

And [node-config](https://github.com/lorenwest/node-config) for use of the config module.

```json
// in config/defaults.json
{
  "winston": {
    "level": "info",
    "transports": [{
      "type": "Console"
    }]
  }
}
```

```javascript
const log = require('winston-cfg').winstonCfg();
```

```typescript
import { winstonCfg } from 'winston-cfg';
const log = winstongCfg();
```

### Advanced Configuration

#### transportMap

Since transports may be external modules, `winston` expects to be provided
instances of transports associated with a logger - global or custom.

We are however attempting to expose only the config capability. As a compromise, `winston-cfg` adds a 'type' property to the config. The application also has to instantiate a `transportMap`, which allows the `winston-cfg` to create
appropriate transports before instantiating loggers.

By default, `winston-core` supports four transports: `Console`, `File`, `Http` & `Memory`. Additionally, [3rd-party transports](https://github.com/winstonjs/winston/blob/master/docs/transports.md)
extend support for other storage mechanisms.

##### Config file

Please see the interface definition in [src/index.ts:Config](https://github.com/sramam/winston-cfg/blob/master/src/index.ts#L10) for details
on valid config settings.

And [node-config](https://github.com/lorenwest/node-config) for use of the config module.

```json
{
  "winston": {
    "level": "info",
    "transports": [
      {
        "type": "Console"
      },
      {
        "type": "File",
        "filename": "./winston.log"
      },
      {
        "type": "CouchDB",
        // ... CouchDb Config.
      }
    ],
    "loggers": [{
      "id": "app",
      "level": "info",
      "transports": [{
        "type": "SimpleDB",
        // ...
      }],
    }, {
      "id": "http"
    }]
  }
}
```

##### TypeScript boilerplate

```typescript

// do this in your application startup

import { winstonCfg } from 'winston-cfg';

// import custom transports
import { Couchdb as CouchDB } from 'winston-couchdb';
import { SimpleDB } from 'winston-simpledb';

// prepare a transport map for initialization
const transportMap = {
  'CouchDB': CouchDB,
  'SimpleDB': SimpleDB
};

// read config and initialize winston appropriately.
// See [node-config](https://github.com/lorenwest/node-config) for details.
const winston = winstonCfg(transportMap);

// get handles to individual loggers
const log = winston; // default logger
const app_log = winston.loggers.get('app');
const http_log = winston.loggers.get('http');

// use log, app_log & http_log as needed.
```

##### JavaScript boilerplate

```js
const logger = 'winston-cfg';

// import custom transports
const CouchDB = require('winston-couchdb').CouchDb;
const SimpleDB = require('winston-simpledb').SimpleDB;

// prepare a transport map for initialization
const transportMap = {
  'CouchDB': CouchDB,
  'SimpleDB': SimpleDB
};

// read config and initialize winston appropriately.
// See [node-config](https://github.com/lorenwest/node-config) for details.
const winston = winstonCfg(transportMap);

// get handles to individual loggers
const log = winston; // default logger
const app_log = winston.loggers.get('app');
const http_log = winston.loggers.get('http');

// use log, app_log & http_log as needed.
```

## License

Apache 2.0

## Code of Conduct

Please note that this project is released with a [Contributor Code of Conduct](code-of-conduct.md).
By participating in this project you agree to abide by its terms.

## Support

Bugs, PRs, comments, suggestions are all welcomed!
