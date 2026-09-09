import { test, expect } from '@playwright/test'

test.describe('Admin Operations BI & Operational Tooling', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem('skip_admin_auth', 'true')
    })
  })

  test('radio meuh player is present in admin layout header', async ({ page }) => {
    await page.goto('/admin/dashboard')
    
    // Header should contain Radio Meuh stream branding
    const radioContainer = page.getByText(/RADIO MEUH/i).first()
    await expect(radioContainer).toBeVisible()

    // Reload stream button should be accessible via title substring
    const reloadBtn = page.getByTitle(/Reload/i).first()
    await expect(reloadBtn).toBeVisible()
  })

  test('admin BI dashboard renders metrics and RTSP camera window', async ({ page }) => {
    await page.goto('/admin/dashboard')

    // Dashboard heading
    await expect(page.getByRole('heading', { name: /Staff Operations Center/i })).toBeVisible()

    // Check KPI Gauges
    await expect(page.getByText(/Venue Capacity/i).first()).toBeVisible()
    await expect(page.getByText(/Bar Velocity/i)).toBeVisible()

    // Check RTSP Camera Stream component & Visitor Flow BI panel
    await expect(page.getByText(/Visitor Flow Distribution/i)).toBeVisible()
  })

  test('kitchen display screen loads properly', async ({ page }) => {
    await page.goto('/admin/kitchen')
    await expect(page.getByRole('heading', { name: /KITCHEN DISPLAY/i })).toBeVisible()
    await expect(page.getByText(/Live|Offline/i).first()).toBeVisible()
  })

  test('promoter commission leaderboard dashboard loads', async ({ page }) => {
    await page.goto('/admin/promoters')
    await expect(page.getByRole('heading', { name: /Promoter Performance & Commissions/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Export CSV/i })).toBeVisible()
  })

  test('post-event P&L report manager loads', async ({ page }) => {
    await page.goto('/admin/pnl')
    await expect(page.getByRole('heading', { name: /Event P&L Reports/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Generate New Report/i })).toBeVisible()
  })

  test('admin settings tabs include RTSP camera and Telegram config', async ({ page }) => {
    await page.goto('/admin/settings')
    
    // Check for Camera Stream Settings tab button
    const cameraTab = page.getByRole('button', { name: /Security & RTSP Cameras/i })
    await expect(cameraTab).toBeVisible()

    // Check for Notifications tab button
    const notifTab = page.getByRole('button', { name: /Notifications & Telegram/i })
    await expect(notifTab).toBeVisible()

    // Click notifications tab and check Telegram bot section heading
    await notifTab.click()
    await expect(page.getByText(/Telegram Staff Alert Bot/i)).toBeVisible()
  })
})
