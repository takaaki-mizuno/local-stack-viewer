#!/usr/bin/env node

const { SESClient, SendEmailCommand, VerifyEmailIdentityCommand } = require('@aws-sdk/client-ses');

const sesClient = new SESClient({
  endpoint: process.env.LOCALSTACK_ENDPOINT || 'http://localhost:4566',
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
});

async function setupE2ETestData() {
  try {
    console.log('Setting up E2E test data for SES...');
    
    // メールアドレスの認証
    const emailsToVerify = [
      'sender@example.com',
      'notification@example.com', 
      'noreply@example.com'
    ];
    
    console.log('Verifying email addresses...');
    for (const email of emailsToVerify) {
      const verifyCommand = new VerifyEmailIdentityCommand({
        EmailAddress: email
      });
      await sesClient.send(verifyCommand);
      console.log(`Email verified: ${email}`);
    }
    
    // 少し待機
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // テストメール 1
    const email1 = new SendEmailCommand({
      Source: 'sender@example.com',
      Destination: {
        ToAddresses: ['recipient@example.com'],
      },
      Message: {
        Subject: {
          Data: 'テストメール 1',
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: 'これはテストメールの本文です。',
            Charset: 'UTF-8',
          },
          Html: {
            Data: '<p>これは<strong>テストメール</strong>の本文です。</p>',
            Charset: 'UTF-8',
          },
        },
      },
    });

    // お知らせ
    const email2 = new SendEmailCommand({
      Source: 'notification@example.com',
      Destination: {
        ToAddresses: ['user@example.com'],
      },
      Message: {
        Subject: {
          Data: 'お知らせ',
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: '重要なお知らせがあります。',
            Charset: 'UTF-8',
          },
          Html: {
            Data: '<p>重要な<strong>お知らせ</strong>があります。</p>',
            Charset: 'UTF-8',
          },
        },
      },
    });

    // 登録完了のお知らせ
    const email3 = new SendEmailCommand({
      Source: 'noreply@example.com',
      Destination: {
        ToAddresses: ['newuser@example.com'],
      },
      Message: {
        Subject: {
          Data: '登録完了のお知らせ',
          Charset: 'UTF-8',
        },
        Body: {
          Text: {
            Data: 'ユーザー登録が完了しました。',
            Charset: 'UTF-8',
          },
          Html: {
            Data: '<p>ユーザー<strong>登録が完了</strong>しました。</p>',
            Charset: 'UTF-8',
          },
        },
      },
    });

    // メールを順番に送信
    const response1 = await sesClient.send(email1);
    console.log('Email 1 sent:', response1.MessageId);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response2 = await sesClient.send(email2);
    console.log('Email 2 sent:', response2.MessageId);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const response3 = await sesClient.send(email3);
    console.log('Email 3 sent:', response3.MessageId);
    
    console.log('E2E test data setup completed successfully!');
  } catch (error) {
    console.error('Failed to setup E2E test data:', error);
    process.exit(1);
  }
}

setupE2ETestData();