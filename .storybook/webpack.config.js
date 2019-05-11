const path = require('path');
const SRC_PATH = path.join(__dirname, '../src');
const STORIES_PATH = path.join(__dirname, '../stories');
const CONFIG_PATH = path.join(__dirname, '../tsconfig.js');
module.exports = ({ config, mode }) => {
  if (Array.isArray(config.entry)) {
    const { entry } = config;
    entry.splice(entry.findIndex(e => /.*polyfills.js$/.test(e)), 1);
  }
  config.module.rules.push({
    test: /\.(ts|tsx)$/,
    include: [SRC_PATH, STORIES_PATH],
    use: [
      {
        loader: require.resolve('awesome-typescript-loader'),
        options: {
          configFileName: CONFIG_PATH
        }
      },
      { loader: require.resolve('react-docgen-typescript-loader') }
    ],
    exclude: /node_modules/
  });
  config.resolve.extensions.push('.ts', '.tsx');
  delete config.resolve.alias['core-js'];
  return config;
};
