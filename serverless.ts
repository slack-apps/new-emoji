import type { AWS } from '@serverless/typescript';

import hello from 'src/functions/hello';

const serverlessConfiguration: AWS = {
  service: 'typescript-serverless-boilerplate',
  frameworkVersion: '3',
  useDotenv: true,
  plugins: ['serverless-offline', 'serverless-esbuild'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      SLACK_SIGNING_SECRET: process.env['SLACK_SIGNING_SECRET'] as string,
      SLACK_BOT_TOKEN: process.env['SLACK_BOT_TOKEN'] as string,
      CHANNEL_TO_NOTIFY: process.env['CHANNEL_TO_NOTIFY'] as string,
    },
  },
  functions: { hello },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
