import fs from 'fs';
import tmp from 'tmp';
const Diff2Html = require('diff2html').Diff2Html;
const exec = require('child_process').exec;
// const exec = require('child-process-promise').exec;

const oneGigInBytes = 1073741824;

export default async (req, res) => {
  const { blob1, blob2 } = req.body;
  const differ = req.body.differ || 'git';

  if (!blob1 || !blob2) {
    return res.status(400);
  }

  // write out blobs to temp files to make it
  // easier + safer to diff them
  const blob1File = tmp.fileSync();
  const blob2File = tmp.fileSync();

  fs.writeSync(blob1File.fd, blob1);
  fs.writeSync(blob2File.fd, blob2);

  exec(
    `git diff --ignore-all-space --no-index "${blob1File.name}" "${blob2File.name}"`,
    { maxBuffer: oneGigInBytes - 1 },
    (err, stdout) => {
      // git diff returns 1 when it found a difference
      if (err && err.code == 1) {
          err = null;
      }

      const html = Diff2Html.getPrettyHtml(stdout, { inputFormat: 'diff' })

      res.status(200).send({ blob1, blob2, html });
    }
  );
}
