const isDev = process.env.NODE_ENV === 'development';
// import { i18n }  from './next-i18next.config'
// const { i18n } = require('./next-i18next.config');
import path from 'path';
import fs from 'fs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // i18n,
  i18n: {
    defaultLocale: 'zh',
    locales: ['en', 'zh'],
    localeDetection: false
  },
  // localePath:
  //   typeof window === 'undefined' ? require('path').resolve('./packages/web/i18n') : '/i18n',
  // reloadOnPrerender: process.env.NODE_ENV === 'development'
  output: 'standalone',
  reactStrictMode: isDev ? false : true,
  compress: true,
  webpack(config, { isServer, nextRuntime }) {
    // Object.assign(config.resolve.alias, {
    //   '@mongodb-js/zstd': false,
    //   '@aws-sdk/credential-providers': false,
    //   snappy: false,
    //   aws4: false,
    //   'mongodb-client-encryption': false,
    //   kerberos: false,
    //   'supports-color': false,
    //   'bson-ext': false,
    //   'pg-native': false
    // });
    config.module = {
      ...config.module,
      rules: config.module.rules.concat([
        {
          test: /\.svg$/i,
          issuer: /\.[jt]sx?$/,
          use: ['@svgr/webpack']
        },
        {
          test: /\.node$/,
          use: [{ loader: 'nextjs-node-loader' }]
        }
      ]),
      exprContextCritical: false,
      unknownContextCritical: false
    };

    if (!config.externals) {
      config.externals = [];
    }

    // if (isServer) {
    //   // config.externals.push('@zilliz/milvus2-sdk-node');

    //   if (nextRuntime === 'nodejs') {
    //     const oldEntry = config.entry;
    //     config = {
    //       ...config,
    //       async entry(...args) {
    //         const entries = await oldEntry(...args);
    //         return {
    //           ...entries,
    //           ...getWorkerConfig(),
    //           'worker/systemPluginRun': path.resolve(
    //             process.cwd(),
    //             './packages/plugins/runtime/worker.ts'
    //           )
    //         };
    //       }
    //     };
    //   }
    // } else {
      config.resolve = {
        ...config.resolve,
        fallback: {
          ...config.resolve.fallback,
          fs: false
        }
      };
    // }

    config.experiments = {
      asyncWebAssembly: true,
      layers: true
    };

    return config;
  },
};

function getWorkerConfig() {
  const result = fs.readdirSync(path.resolve(__dirname, './packages/service/worker'));

  // 获取所有的目录名
  const folderList = result.filter((item) => {
    return fs
      .statSync(path.resolve(__dirname, './packages/service/worker', item))
      .isDirectory();
  });

  /* 
    {
      'worker/htmlStr2Md': path.resolve(
                process.cwd(),
                '../../packages/service/worker/htmlStr2Md/index.ts'
              ),
              'worker/countGptMessagesTokens': path.resolve(
                process.cwd(),
                '../../packages/service/worker/countGptMessagesTokens/index.ts'
              ),
              'worker/readFile': path.resolve(
                process.cwd(),
                '../../packages/service/worker/readFile/index.ts'
              )
    }
  */
  const workerConfig = folderList.reduce((acc, item) => {
    acc[`worker/${item}`] = path.resolve(
      process.cwd(),
      `./packages/service/worker/${item}/index.ts`
    );
    return acc;
  }, {});
  return workerConfig;
}


export default nextConfig;
