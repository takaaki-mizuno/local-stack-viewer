import '@testing-library/jest-dom'
import { TextEncoder, TextDecoder } from 'util'

// TextEncoderとTextDecoderをグローバルに追加（Node.js環境用）
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// LocalStack環境変数をテスト用に設定
process.env.LOCALSTACK_ENDPOINT = 'http://localhost:4566'
process.env.AWS_ACCESS_KEY_ID = 'test'
process.env.AWS_SECRET_ACCESS_KEY = 'test'
process.env.AWS_DEFAULT_REGION = 'us-east-1'