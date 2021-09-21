const fs = require('fs');
const replace = require('replace-in-file');
const appSettings = require('./app_settings.json');
const rp_hostname = process.env.rp_hostname;
const value_key = process.env.value_key;
const rp_contact_group = process.env.rp_contact_group;
const write_patient_state_flow = process.env.write_patient_state_flow;

const search = (haystack, needle) => needle in haystack ? haystack[needle] : Object.values(haystack).reduce((acc, val) => {
  if (acc !== undefined) {
    return acc;
  } 
  if (typeof val === 'object') return search(val, needle);
}, undefined);

const regex = expr => new RegExp(expr, 'g');

const options = {
  files: './app_settings.json',
  from: [regex(search(appSettings, 'base_url')), regex(search(appSettings, 'value_key')), search(appSettings, 'groups').expr, search(appSettings, 'flow').expr],
  to: [rp_hostname, value_key, `['${rp_contact_group}']`, `'${write_patient_state_flow}'`]
};

replace(options);
