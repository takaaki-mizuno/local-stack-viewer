import { execSync } from 'child_process';

async function globalSetup() {
  console.log('Setting up E2E test data...');
  
  try {
    // LocalStackのヘルスチェック
    execSync('curl -s http://localhost:4566/_localstack/health', { 
      stdio: 'ignore',
      timeout: 5000 
    });
    
    // SESデータをクリア
    try {
      execSync('curl -X DELETE http://localhost:4566/_aws/ses', { 
        stdio: 'ignore',
        timeout: 5000 
      });
      console.log('Cleared existing SES data');
    } catch (error) {
      console.log('Could not clear SES data (this is normal)');
    }
    
    // 少し待機
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // テストデータの準備
    execSync('node scripts/setup-e2e-test-data.js', { 
      stdio: 'inherit',
      timeout: 10000 
    });
    
    // データが反映されるまで少し待機
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('E2E test setup completed successfully');
  } catch (error) {
    console.warn('Warning: Could not setup E2E test data. LocalStack might not be running.');
    console.warn('Please start LocalStack and run: npm run test:e2e');
  }
}

export default globalSetup;