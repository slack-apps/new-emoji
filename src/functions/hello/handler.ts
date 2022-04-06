import { App, AwsLambdaReceiver } from '@slack/bolt';
import { AwsCallback, AwsEvent } from '@slack/bolt/dist/receivers/AwsLambdaReceiver';
import { isGenericMessageEvent } from '@libs/helper';

const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env['SLACK_SIGNING_SECRET'] as string,
});

const app = new App({
  token: process.env['SLACK_BOT_TOKEN'] as string,
  receiver: awsLambdaReceiver,
  processBeforeResponse: true,
});

app.message('hello', async ({ message, say }) => {
  if (!isGenericMessageEvent(message)) {
    return;
  }

  await say({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Hey there <@${message.user}>!`,
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Click Me',
          },
          action_id: 'button_click',
        },
      },
    ],
    text: `Hey there <@${message.user}>!`,
  });
});

app.action('button_click', async ({ body, ack, say }) => {
  await ack();
  await say(`<@${body.user.id}> clicked the button`);
});

module.exports.main = async (event: AwsEvent, context: any, callback: AwsCallback) => {
  const handler = await awsLambdaReceiver.start();

  return handler(event, context, callback);
};
