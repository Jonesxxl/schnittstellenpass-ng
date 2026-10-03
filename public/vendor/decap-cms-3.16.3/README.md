# Decap CMS 3.16.3

Unmodified copy of `dist/decap-cms.js`, its lazily loaded chunks (`*.decap-cms.js`),
the two WebAssembly files they load and `decap-cms.js.LICENSE.txt` from the npm
package [decap-cms@3.16.3](https://www.npmjs.com/package/decap-cms/v/3.16.3)
(MIT license, https://github.com/decaporg/decap-cms).

Served from this site instead of a CDN, so the CMS page (which holds the editor's
GitHub token) only runs scripts from its own origin. Installing the npm package
would pull its whole dependency tree into every build.

Update to a new version:

```bash
npm pack decap-cms@<version>
tar -xzf decap-cms-<version>.tgz
mkdir public/vendor/decap-cms-<version>
cp package/dist/*decap-cms.js package/dist/*.wasm package/dist/decap-cms.js.LICENSE.txt public/vendor/decap-cms-<version>/
```

Then copy this README, point the script in `public/admin/index.html` to the new
folder and delete the old one.
