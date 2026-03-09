const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

async function build() {
  const tmpfile = path.join(__dirname, 'mermaid.tmp.js');
  const outfile = path.join(__dirname, 'mermaid.js');

  console.log('Bundling with esbuild...');
  await esbuild.build({
    entryPoints: [path.join(__dirname, 'entry.js')],
    bundle: true,
    minify: false,
    outfile: tmpfile,
    format: 'esm',
    target: 'es2020',
    define: {
      'DecodingMode.Strict': '1',
      'DecodingMode.Legacy': '0',
      'DecodingMode.Attribute': '2',
    },
    external: ['shiki', 'fs', 'path', 'util', 'stream'],
  });

  console.log('Applying patches...');
  let content = fs.readFileSync(tmpfile, 'utf8');

  const patch = (name, regex, replacement, required = false) => {
    const oldContent = content;
    content = content.replace(regex, replacement);
    if (content !== oldContent) {
      console.log(`- Applied patch: ${name}`);
    } else if (required) {
      console.warn(`- Failed to apply REQUIRED patch: ${name}`);
    }
  };

  // Patch $wnd.Math, $wnd.Array, etc. to remove $wnd. prefix
  patch('Math', /\$wnd\.Math\./g, 'Math.');
  patch('Array', /\$wnd\.Array/g, 'Array');
  patch('Object', /\$wnd\.Object/g, 'Object');
  patch('String', /\$wnd\.String/g, 'String');
  patch('Number', /\$wnd\.Number/g, 'Number');
  patch('Boolean', /\$wnd\.Boolean/g, 'Boolean');
  patch('Date', /\$wnd\.Date/g, 'Date');
  patch('RegExp', /\$wnd\.RegExp/g, 'RegExp');

  // Patch Error.stackTraceLimit assignment
  patch(
    'stackTraceLimit',
    /\$wnd\.Error\.stackTraceLimit\s*=\s*Error\.stackTraceLimit\s*=\s*64/g,
    'Error.stackTraceLimit = 64',
    true
  );

  fs.writeFileSync(tmpfile, content);

  console.log('Minifying patched bundle...');
  await esbuild.build({
    entryPoints: [tmpfile],
    bundle: false,
    minify: true,
    outfile: outfile,
    format: 'esm',
    target: 'es2020',
  });

  fs.unlinkSync(tmpfile);
  console.log('Build complete: js/mermaid.js');
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
