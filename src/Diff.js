
import { SOURCE, HTML_OUT, DIFFER } from './constants';
import GitDiff from './GitDiff';

const DIFFER_SERVICE = {
  'git': GitDiff
}

export default async (req, res) => {
  const { url1, url2 } = req.body;
  const source = req.body.source || SOURCE.URL;
  const html = req.body.html || HTML_OUT.NO_HEAD;
  const differ = req.body.differ || DIFFER.GIT;
  const differService = DIFFER_SERVICE[differ];

  if (!url1 || !url2 || !differService) {
    return res.status(400).send(`
      Invalid params
      "url1" and "url2" are required, and "differ" must be one of "git", "XXX"
    `);
  }

  // get the blobs we need to compare
  let blob1 = url1;
  let blob2 = url2;
  if (source === SOURCE.URL) {
    return res.status(500).send('URL source not supported yet, sorry...');
  }

  const options = {
    html
  }

  // get the diff
  const diff = await differService(blob1, blob2, options);

  return res.status(200).send({ url1, url2, diff });
}
