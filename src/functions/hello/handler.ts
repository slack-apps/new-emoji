import { App, AwsLambdaReceiver } from '@slack/bolt';
import { AwsCallback, AwsEvent } from '@slack/bolt/dist/receivers/AwsLambdaReceiver';

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env['SLACK_SIGNING_SECRET'] as string,
});

const app = new App({
  token: process.env['SLACK_BOT_TOKEN'] as string,
  receiver: awsLambdaReceiver,
  processBeforeResponse: true,
});

app.event('emoji_changed', async ({ event, client, logger }) => {
  if (event.subtype !== 'add') {
    return;
  }

  const { name } = event;

  try {
    await client.chat.postMessage({
      channel: process.env['CHANNEL_TO_NOTIFY'] as string,
      text: `🎉 A new emoji has been added! :${name}: \`:${name}:\``,
    });
  } catch (error) {
    logger.error(error);
  }
});

module.exports.main = async (event: AwsEvent, context: any, callback: AwsCallback) => {
  const handler = await awsLambdaReceiver.start();

  return handler(event, context, callback);
};
