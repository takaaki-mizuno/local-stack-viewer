#!/usr/bin/env node

const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');

const sesClient = new SESClient({
  endpoint: process.env.LOCALSTACK_ENDPOINT || 'http://localhost:4566',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
});

async function sendTestEmail() {
  try {
    console.log('Sending test email to LocalStack SES...');
    
    const command = new SendEmailCommand({
      Source: 'test@example.com',
      Destination: {
        ToAddresses: ['recipient@example.com'],
      },
      Message: {
        Subject: {
          Data: 'テストメール - LocalStack',
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: 'これはLocalStackへのテストメールです。',
            Charset: 'UTF-8',
          },
          Html: {
            Data: '<p>これは<strong>LocalStack</strong>へのテストメールです。</p>',
            Charset: 'UTF-8',
          },
        },
      },
    });

    const response = await sesClient.send(command);
    console.log('Email sent successfully:', response.MessageId);
  } catch (error) {
    console.error('Failed to send email:', error);
  }
}

// すぐに実行
sendTestEmail();

// 追加のテストメールを送信
setTimeout(() => {
  const command2 = new SendEmailCommand({
    Source: 'admin@example.com',
    Destination: {
      ToAddresses: ['user1@example.com', 'user2@example.com'],
    },
    Message: {
      Subject: {
        Data: '複数宛先テスト',
        Charset: 'UTF-8',
      },
      Body: {
        Text: {
          Data: '複数の宛先に送信するテストです。',
          Charset: 'UTF-8',
        },
      },
    },
  });
  
  sesClient.send(command2).then((response) => {
    console.log('Second email sent:', response.MessageId);
  }).catch(console.error);
}, 1000);