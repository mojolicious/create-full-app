#!/usr/bin/env node
import mojo from '@mojojs/core';

const app = mojo({detectImport: false});
app.start('create-full-app', ...process.argv.slice(2));
