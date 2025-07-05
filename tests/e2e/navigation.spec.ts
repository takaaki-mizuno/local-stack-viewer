import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('ナビゲーションが正しく動作する', async ({ page }) => {
    await page.goto('/')

    // ダッシュボードページの確認
    await expect(page.locator('main').getByRole('heading', { level: 1 })).toContainText('LS Viewer')
    
    // S3ページに移動
    await page.getByRole('link', { name: 'S3 Buckets' }).click()
    await expect(page).toHaveURL('/s3')
    await expect(page.locator('main').getByRole('heading', { level: 1 })).toContainText('S3 Buckets')
    
    // SESページに移動
    await page.getByRole('link', { name: 'SES Messages' }).click()
    await expect(page).toHaveURL('/ses')
    await expect(page.locator('main').getByRole('heading', { level: 1 })).toContainText('SES Messages')
    
    // ダッシュボードに戻る
    await page.getByRole('link', { name: 'Home' }).click()
    await expect(page).toHaveURL('/')
    await expect(page.locator('main').getByRole('heading', { level: 1 })).toContainText('LS Viewer')
  })

  test('モバイル表示が正しく動作する', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // ナビゲーションが表示される
    await expect(page.locator('nav').getByText('LS Viewer')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'S3 Buckets' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'SES Messages' })).toBeVisible()
  })
})