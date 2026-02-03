import fs from 'node:fs';

export default async function postBuild() {
  return {
    name: 'post-build',
    closeBundle: async () => {
      console.log('Moving all HTML files from /dist/src/pages to /dist');
      try {
        fs.cpSync(`${__dirname}/dist/src/pages`, `${__dirname}/dist`, {recursive: true});
        fs.rmSync(`${__dirname}/dist/src`, {recursive: true, force: true});
      } catch (error) {
        console.error('Error:', error);
      }
      console.log('Finished.');
    },
  };
}
