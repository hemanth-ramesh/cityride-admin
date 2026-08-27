import { test, expect } from '@playwright/test';

test.describe('CITYRIDE Admin OCC — Login to Live Operations Flow', () => {
  test('should login as Super Admin and navigate to Live Fleet Operations Command Center', async ({ page }) => {
    // 1. Visit the login page
    await page.goto('/login');
    await expect(page).toHaveTitle(/CITYRIDE/i);
    await expect(page.locator('text=Operations Control Center')).toBeVisible();

    // 2. Click 1-Click Super Admin Demo Login
    const superAdminBtn = page.locator('button:has-text("Super Admin")');
    await expect(superAdminBtn).toBeVisible();
    await superAdminBtn.click();

    // 3. Verify successful redirection to Dashboard Overview
    await page.waitForURL('**/dashboard');
    await expect(page.locator('h1:has-text("City Transit Operations")')).toBeVisible();
    await expect(page.locator('text=Super Admin')).toBeVisible();

    // 4. Navigate to Live Fleet Map Command Center
    const liveOpsNavLink = page.locator('a[href="/operations/live"]');
    await expect(liveOpsNavLink).toBeVisible();
    await liveOpsNavLink.click();

    // 5. Verify Live Command Center is loaded
    await page.waitForURL('**/operations/live');
    await expect(page.locator('h1:has-text("Live Operations Command Center")')).toBeVisible();

    // 6. Verify Telemetry & Active Fleet Metrics
    await expect(page.locator('text=Active Buses in Service')).toBeVisible();
    await expect(page.locator('text=Network On-Time SLA')).toBeVisible();

    // 7. Verify Live Map & Bus Markers
    const fleetMap = page.locator('div:has-text("Tumakuru Public Transit Radar")');
    await expect(fleetMap).toBeVisible();

    // 8. Verify Active Trip Stream list
    await expect(page.locator('text=Active Monitored Trips')).toBeVisible();
    await expect(page.locator('text=KA 06 F 8558')).toBeVisible();
  });

  test('should enforce RBAC access restrictions for Support Admin role', async ({ page }) => {
    // 1. Visit login
    await page.goto('/login');

    // 2. Login as Support Admin
    const supportAdminBtn = page.locator('button:has-text("Support Admin")');
    await supportAdminBtn.click();
    await page.waitForURL('**/dashboard');

    // 3. Support Admin should have access to Passenger Desk & Complaints
    const paxLink = page.locator('a[href="/passengers"]');
    await expect(paxLink).toBeVisible();
    await paxLink.click();
    await page.waitForURL('**/passengers');
    await expect(page.locator('h1:has-text("Passenger Accounts & Directory")')).toBeVisible();

    // 4. Support Admin trying to access restricted Dispatch Board should be redirected
    await page.goto('/duties/dispatch-board');
    // Guarded route will redirect to unauthorized / dashboard
    await expect(page).not.toHaveURL('**/duties/dispatch-board');
  });
});
