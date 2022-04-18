const fetch = require('node-fetch');

exports.it = async (description, req, expect) => {
  if (!req) {
    console.log(`<< SKIP >> ${description || 'Anonymous'}`);

    return false;
  }

  const res = req.data ? await fetch(req.url, {
    body: JSON.stringify(req.data),
    headers: { 'Content-type': 'application/json' },
    method: req.method
  }) : await fetch(req.url);

  res.data = await res.json();

  if (res.data.timestamp) {
    delete res.data.timestamp;
  }

  let received = res.data;

  console.log(`<< TEST >> ${description}`);

  if (expect.hasOwnProperty('_omit')) {
    expect._omit.forEach(k => k === delete received[k]);

    delete expect._omit;
  }

  if (JSON.stringify(received) === JSON.stringify(expect)) {
    console.log('\x1b[32m<< PASS >>\x1b[0m', received);

    return true;
  }
  else {
    console.log(`\x1b[31m<< FAIL >>\x1b[33m\n\nEXPECTED: ${JSON.stringify(expect)}\n\x1b[31mRECEIVED: ${JSON.stringify(received)}\x1b[0m\n`);

    return false;
  }
};
