const fs = require('fs');
const path = require('path');
const {JSDOM} = require('jsdom');

test('navbar becomes sticky when scrollTop exceeds 50', () => {
  const html = `<!DOCTYPE html><html><head></head><body><nav class="navbar"></nav></body></html>`;
  const dom = new JSDOM(html, { runScripts: 'dangerously', resources: 'usable' });
  const { window } = dom;
  const { document } = window;

  // load jQuery from local file
  const jqueryPath = path.join(__dirname, '../js/jquery.min.js');
  const jqueryCode = fs.readFileSync(jqueryPath, 'utf8');
  const jqueryScript = document.createElement('script');
  jqueryScript.textContent = jqueryCode;
  document.body.appendChild(jqueryScript);

  // load custom JS which contains the sticky logic
  const customPath = path.join(__dirname, '../js/custom.js');
  const customCode = fs.readFileSync(customPath, 'utf8');
  const customScript = document.createElement('script');
  customScript.textContent = customCode;
  document.body.appendChild(customScript);

  // set scroll position and dispatch scroll event
  Object.defineProperty(window, 'pageYOffset', { writable: true, value: 60 });
  window.dispatchEvent(new window.Event('scroll'));

  const nav = document.querySelector('.navbar');
  expect(nav.classList.contains('sticky')).toBe(true);
});