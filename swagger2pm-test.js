#!/usr/bin/env node
'use strict';

const program = require('commander');
const swagger = require('./swagger');
// @ts-ignore
const pkg = require('./package.json');

// Only for test
process.env.NODE_TLS_REJECT_UNAUTHORIZED="0";

program
  .version(pkg.version, '-v, --version')
  .usage('<JSON or YAML Swagger file definition> [options]')
  .arguments('<file>')
  .option('-g --global [var]', 'Add global variables', (option, options) => {
    try {
        option.split(',').forEach(e => {
            var global = e.trim().split('=')
            options.push({ name: global[0].trim(), value: global[1].trim() });            
        });
    } catch(err) {
      process.stdout.write('Invalid global variables option. Use var1=value1,var2=value2\n'); 
        process.exit(500);
    }

    return options;
  }, [])
  .option('-r, --run [dataFile]', 'Run postman collection using newman cli. You can include json/csv file to variables data.')
  .option('-s, --save', 'Save postman collection to disk')
  .option('-t, --tokenUrl [tokenUrl]', 'Override token url in swagger.')
  .description('Create Postman collection with test from swagger')
  .action((req, options) => {
    swagger(req, options, result => { process.exit(result); });
  });

program.parse(process.argv);

if (!program.args.length) program.help();