const sass = require('sass');
const esbuild = require('esbuild');
const fs = require('node:fs');

const compile = ({
    dir,
}) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    const compiledSass = sass.compile('./main.scss', {
      outputStyle: 'compressed',
    });

    const compiler = {
        compile: (entryFile) => {
            return esbuild.buildSync({
                entryPoints: [entryFile],
                bundle: true,
                write: false,
            }).outputFiles[0].text;
        }
    };

    const compiledJs = compiler.compile('./main.js');

    fs.writeFileSync(`./${dir}/custom.css`, compiledSass.css);
    fs.writeFileSync(`./${dir}/custom.js`, compiledJs);
}

const defaultOptions = {
    dir: './build',
};

const [_, __, ...args] = process.argv;
const cmdOptions = {};

args.forEach(element => {
    const [key, value] = element.split('=');
    const formattedKey = key.replace('--', '');
    cmdOptions[formattedKey] = value
});

const options = { ...defaultOptions, ...cmdOptions };

compile(options);
