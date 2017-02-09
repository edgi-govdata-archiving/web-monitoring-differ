import fs from 'fs';
import tmp from 'tmp';
import Promise from 'bluebird';

const Diff2Html = require('diff2html').Diff2Html;
const exec = require('child_process').exec;

const oneGigInBytes = 1073741824;

export default function gitDiff(blob1, blob2, options) {
  // write out blobs to temp files to make it
  // easier + safer to diff them
  const blob1File = tmp.fileSync();
  const blob2File = tmp.fileSync();

  fs.writeSync(blob1File.fd, blob1);
  fs.writeSync(blob2File.fd, blob2);

  return new Promise((resolve, reject) => {
    exec(
      `git diff --ignore-all-space --no-index "${blob1File.name}" "${blob2File.name}"`,
      { maxBuffer: oneGigInBytes - 1 },
      (err, stdout) => {
        // clean up temp files
        blob1File.removeCallback();
        blob2File.removeCallback();

        // git diff returns 1 when it found a difference
        if (err && err.code != 1) {
            return reject(err);
        }

        const html = Diff2Html.getPrettyHtml(stdout, { inputFormat: 'diff' });

        return resolve(html);
      }
    );
  });
}
