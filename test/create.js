import child_process from 'node:child_process';
import util from 'node:util';
import Path from '@mojojs/path';
import t from 'tap';

const execFile = util.promisify(child_process.execFile);

t.test('Create', async t => {
  const path = (await new Path('bin.js').realpath()).toString();

  await t.test('Help', async t => {
    const {stdout, stderr} = await execFile('node', [path, '-h']);
    t.match(stdout, /Usage: APPLICATION create-full-app/s);
    t.equal(stderr, '');
  });

  await t.test('Defaults', async t => {
    const dir = await Path.tempDir();
    const cwd = process.cwd();
    process.chdir(dir.toString());

    const {stdout, stderr} = await execFile('node', [path]);
    t.match(stdout, /Generating application directory structure:/s);
    t.equal(stderr, '');
    t.ok(await dir.child('index.js').exists());
    t.ok(await dir.child('package.json').exists());
    t.match(await dir.child('index.js').readFile('utf8'), /app.start()/s);
    t.match(await dir.child('package.json').readFile('utf8'), /@mojojs/s);

    process.chdir(cwd);
  });

  await t.test('TypeScript', async t => {
    const dir = await Path.tempDir();
    const cwd = process.cwd();
    process.chdir(dir.toString());

    const {stdout, stderr} = await execFile('node', [path, '--ts']);
    t.match(stdout, /Generating application directory structure:.+index.ts/s);
    t.equal(stderr, '');
    t.ok(await dir.child('src', 'index.ts').exists());
    t.ok(await dir.child('package.json').exists());
    t.match(await dir.child('src', 'index.ts').readFile('utf8'), /app.start()/s);
    t.match(await dir.child('package.json').readFile('utf8'), /typescript/s);

    process.chdir(cwd);
  });
});
