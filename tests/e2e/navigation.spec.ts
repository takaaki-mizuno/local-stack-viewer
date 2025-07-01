import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('ナビゲーションが正しく動作する', async ({ page }) => {
    await page.goto('/')

    // ダッシュボードページの確認
    await expect(page.locator('main').getByRole('heading', { level: 1 })).toContainText('LocalStack Viewer')
    
    // S3ページに移動
    await page.getByRole('link', { name: 'S3' }).click()
    await expect(page).toHaveURL('/s3')
    await expect(page.locator('main').getByRole('heading', { level: 1 })).toContainText('S3 バケット')
    
    // SESページに移動
    await page.getByRole('link', { name: 'SES' }).click()
    await expect(page).toHaveURL('/ses')
    await expect(page.locator('main').getByRole('heading', { level: 1 })).toContainText('SES メッセージ')
    
    // ダッシュボードに戻る
    await page.getByRole('link', { name: 'ダッシュボード' }).click()
    await expect(page).toHaveURL('/')
    await expect(page.locator('main').getByRole('heading', { level: 1 })).toContainText('LocalStack Viewer')
  })

  test('モバイル表示が正しく動作する', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // ナビゲーションが表示される
    await expect(page.locator('nav').getByText('LocalStack Viewer')).toBeVisible()
    await expect(page.getByRole('link', { name: 'ダッシュボード' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'S3' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'SES' })).toBeVisible()
  })
})