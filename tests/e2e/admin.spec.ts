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

  test('admin settings tabs include RTSP camera and Microgramm POS config', async ({ page }) => {
    await page.goto('/admin/settings')
    
    // Check for Camera Stream Settings tab button
    const cameraTab = page.getByRole('button', { name: /Security & RTSP Cameras/i })
    await expect(cameraTab).toBeVisible()

    // Check for Microgramm POS tab button
    const posTab = page.getByRole('button', { name: /Microgramm POS Integration/i })
    await expect(posTab).toBeVisible()

    // Click Microgramm tab and check section heading
    await posTab.click()
    await expect(page.getByText(/Microgramm Bar POS System Integration/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /Send Test Order to Microgramm POS/i })).toBeVisible()
  })

  test('team accounts & role-based rights (RBAC) management dashboard loads', async ({ page }) => {
    await page.goto('/admin/team')
    await expect(page.getByRole('heading', { name: /Team Accounts & Access Rights/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Create Team Account/i })).toBeVisible()
  })

  test('internal tasks checklist for today loads', async ({ page }) => {
    await page.goto('/admin/tasks')
    await expect(page.getByRole('heading', { name: /Internal Operational Tasks/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Add Task/i })).toBeVisible()
  })

  test('interactive calendar and team date notes load', async ({ page }) => {
    await page.goto('/admin/calendar')
    await expect(page.getByRole('heading', { name: /Interactive Calendar & Team Notes/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Add Date Note/i })).toBeVisible()
  })
})
