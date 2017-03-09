# winston-cfg

A simple utility to blend winston & config, making it easier
to configure winston with config files.

# Usage

## A brief introduction to winston internals

For most common use cases, there are three things that one needs to configure
with winston:

1. _transports_: these are the destination(s) for the logs. Winston provide a few out of the box. Because some of these have extenal dependencies, most are provided as 3rd party npm-modules. Depending on the actual transport, some have pretty involved configuration.
2. _loggers_: these are an ability to segment logging capability. For example by application layer (app, http, db etc). Each logger can have multiple transports - either the global or a custom set.
3. _default logger_: `winston` instantiate a default logger which can be configured in exactly the same manner as any logger.

`winstonCfg.Config` defines a TypeScript interface that enumerates all config
possible on a logger.


## transportMap

Since transports may be external modules, `winston` expects to be provided instances
of transports associated with a logger - global or custom.

We are however attempting to expose only the config capability. As a compromise,
`winston-cfg` adds a 'type' property to the config. The application also has to
instantiate a `transportMap`, which allows the `winston-cfg` to create appropriate
transports before instantiating loggers.

By default, `winston-core` supports four transports: `Console`, `File`, `Http` & `Memory`. Additionally, [3rd-party transports]
(https://github.com/winstonjs/winston/blob/master/docs/transports.md) extend support for other storage mechanisms.


# Config file

```js
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

### TypeScript boilerplate
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

### JavaScript boilerplate:
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

## Support
Bugs, PRs, comments, suggestions welcomed!
