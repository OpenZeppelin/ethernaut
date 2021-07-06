#!/usr/bin/env node

const url = require('url');
const fs = require('fs');

const dsn = process.env.REACT_APP_SENTRY_DSN;

if (dsn === undefined) {
  if (process.env.NETLIFY === 'true') {
    throw new Error('Missing environment variable REACT_APP_SENTRY_DSN');
  } else {
    process.exit();
  }
}

const { protocol, host, path } = url.parse(dsn);
const projectId = path.replace(/^\//, '');

const redirect = `/errors ${protocol}//${host}/api/${projectId}/envelope/ 200`;

fs.mkdirSync('build', { recursive: true });
fs.writeFileSync('build/_redirects', redirect);
