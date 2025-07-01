import { test, expect } from '@playwright/test'

test.describe('SES機能', () => {
  test('SESメッセージ一覧が表示される', async ({ page }) => {
    await page.goto('/ses')

    // ページタイトルの確認
    await expect(page.locator('main').getByRole('heading', { level: 1 })).toContainText('SES メッセージ')
    await expect(page.getByText('3 件のメッセージ')).toBeVisible()

    // メッセージ一覧の確認
    await expect(page.getByText('テストメール 1')).toBeVisible()
    await expect(page.getByText('お知らせ')).toBeVisible()
    await expect(page.getByText('登録完了のお知らせ')).toBeVisible()

    // ステータス表示の確認
    await expect(page.getByText('送信済み')).toBeVisible()
  })

  test('メッセージ詳細が表示される', async ({ page }) => {
    await page.goto('/ses')

    // 最初のメッセージをクリック
    await page.getByText('テストメール 1').click()
    await expect(page).toHaveURL('/ses/mock-message-1')

    // メッセージ詳細の確認
    await expect(page.getByRole('heading', { level: 2 })).toContainText('テストメール 1')
    await expect(page.getByText('sender@example.com')).toBeVisible()
    await expect(page.getByText('recipient@example.com')).toBeVisible()

    // タブの確認
    await expect(page.getByRole('button', { name: 'プレビュー' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'HTMLソース' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'テキスト' })).toBeVisible()
    await expect(page.getByRole('button', { name: '生メッセージ' })).toBeVisible()
  })

  test('メッセージタブが正しく動作する', async ({ page }) => {
    await page.goto('/ses/mock-message-1')

    // HTMLソースタブをクリック
    await page.getByRole('button', { name: 'HTMLソース' }).click()
    await expect(page.getByText('<p>これは<strong>テストメール</strong>の本文です。</p>')).toBeVisible()

    // テキストタブをクリック
    await page.getByRole('button', { name: 'テキスト' }).click()
    await expect(page.getByText('これはテストメールの本文です。')).toBeVisible()

    // 生メッセージタブをクリック
    await page.getByRole('button', { name: '生メッセージ' }).click()
    await expect(page.getByText('From: sender@example.com')).toBeVisible()
  })

  test('戻るボタンが正しく動作する', async ({ page }) => {
    await page.goto('/ses/mock-message-1')

    // 戻るボタンをクリック
    await page.locator('a[href="/ses"]').click()
    await expect(page).toHaveURL('/ses')
    await expect(page.locator('main').getByRole('heading', { level: 1 })).toContainText('SES メッセージ')
  })
})