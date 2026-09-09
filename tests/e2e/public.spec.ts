import { test, expect } from '@playwright/test'

test.describe('Public Pages & QR Ordering', () => {
  test('home page loads cleanly', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Kader/i)
  })

  test('QR digital menu page renders table number and items', async ({ page }) => {
    await page.goto('/order?table=5')
    
    // Check brand and table badge header
    await expect(page.locator('h1')).toContainText(/KADER/i)
    await expect(page.getByText(/Table 5/i)).toBeVisible()

    // Add an item to cart by clicking the first '+' button
    const plusButton = page.locator('button:has-text("+")').first()
    if (await plusButton.isVisible()) {
      await plusButton.click()
      // Check for floating cart bar and Send Order button
      const sendBtn = page.getByRole('button', { name: /Send Order/i })
      await expect(sendBtn).toBeVisible()
    }
  })

  test('pizzeria menu page loads', async ({ page }) => {
    await page.goto('/pizzeria')
    await expect(page.locator('body')).toBeVisible()
  })
})
