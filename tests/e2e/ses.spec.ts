import { test, expect } from '@playwright/test'

test.describe('SES機能', () => {
  test('SESメッセージ一覧が表示される', async ({ page }) => {
    await page.goto('/ses')

    // ページタイトルの確認
    await expect(page.locator('main').getByRole('heading', { level: 1 })).toContainText('SES Messages')
    
    // メッセージ数の確認（複数形であることを確認）
    await expect(page.locator('p').filter({ hasText: /\d+ messages/ })).toBeVisible()

    // メッセージ一覧の確認（特定のロールで検索）
    await expect(page.getByRole('heading', { level: 3 }).filter({ hasText: 'テストメール 1' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 3 }).filter({ hasText: /^お知らせ$/ })).toBeVisible()
    await expect(page.getByRole('heading', { level: 3 }).filter({ hasText: '登録完了のお知らせ' })).toBeVisible()

    // ステータス表示の確認（少なくとも1つ以上のSentステータスが表示されていることを確認）
    const sentStatusCount = await page.getByText('Sent').count()
    expect(sentStatusCount).toBeGreaterThan(0)
  })

  test('メッセージ詳細が表示される', async ({ page }) => {
    await page.goto('/ses')

    // 最初のメッセージをクリック（最初の要素のみ）
    await page.getByText('テストメール 1').first().click()
    
    // URLが /ses/[messageId] 形式になることを確認（具体的なIDは動的）
    await expect(page).toHaveURL(/\/ses\/[a-zA-Z0-9-]+/)

    // メッセージ詳細の確認
    await expect(page.getByRole('heading', { level: 2 })).toContainText('テストメール 1')
    await expect(page.getByText('sender@example.com')).toBeVisible()
    await expect(page.getByText('recipient@example.com')).toBeVisible()

    // タブの確認（日本語ハードコード）
    await expect(page.getByRole('button', { name: 'プレビュー' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'HTMLソース' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'テキスト' })).toBeVisible()
    await expect(page.getByRole('button', { name: '生メッセージ' })).toBeVisible()
  })

  test('メッセージタブが正しく動作する', async ({ page }) => {
    await page.goto('/ses')
    
    // 最初のメッセージをクリックして詳細ページに移動（最初の要素のみ）
    await page.getByText('テストメール 1').first().click()
    await expect(page).toHaveURL(/\/ses\/[a-zA-Z0-9-]+/)

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
    await page.goto('/ses')
    
    // 最初のメッセージをクリックして詳細ページに移動（最初の要素のみ）
    await page.getByText('テストメール 1').first().click()
    await expect(page).toHaveURL(/\/ses\/[a-zA-Z0-9-]+/)

    // 戻るボタンをクリック（戻るボタン専用のセレクター）
    await page.locator('a[href="/ses"]').first().click()
    await expect(page).toHaveURL('/ses')
    await expect(page.locator('main').getByRole('heading', { level: 1 })).toContainText('SES Messages')
  })
})