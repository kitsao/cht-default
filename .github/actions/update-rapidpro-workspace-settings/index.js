const core = require('@actions/core');
const github = require('@actions/github');
const replace = require('replace-in-file');
const path = require('path');
const recursive = require('recursive-readdir');

const search = (haystack, needle) => needle in haystack ? haystack[needle] : Object.values(haystack).reduce((acc, val) => {
  if (acc !== undefined) {
    return acc;
  } 
  if (typeof val === 'object') return search(val, needle);
}, undefined);

const regex = expr => new RegExp(expr, 'g');

try {
  const githubWorkspacePath = process.env['GITHUB_WORKSPACE']
  if (!githubWorkspacePath) {
    throw new Error('GITHUB_WORKSPACE not defined')
  }
  const codeRepository = path.resolve(path.resolve(githubWorkspacePath), core.getInput('directory'));
  process.chdir(codeRepository);
  const appSettings = require(`${codeRepository}/app_settings.json`);
  const rp_hostname = core.getInput('rp_hostname');
  const value_key = core.getInput('value_key');
  const rp_contact_group = core.getInput('rp_contact_group');
  const write_patient_state_flow = core.getInput('write_patient_state_flow');
  const options = {
    files: codeRepository+'/app_settings.json',
    from: [regex(search(appSettings, 'base_url')), regex(search(appSettings, 'value_key')), search(appSettings, 'groups').expr, search(appSettings, 'flow').expr],
    to: [rp_hostname, value_key, `['${rp_contact_group}']`, `'${write_patient_state_flow}'`]
  };

  replace(options);
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
