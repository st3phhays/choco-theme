import { test, expect, Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('./');
});

const testModal = async (page: Page, locator: string, showContactLink: boolean) => {
    await page.click(`[data-bs-target="${locator}"]`);

    await page.locator('body.modal-open').waitFor();

    await expect(page.locator(locator)).toBeVisible();

    if (showContactLink) {
        await expect(page.locator(`${locator} .modal-footer a`)).toContainText('Contact Us');
    }

    await page.locator(`${locator} .modal-footer button[data-bs-dismiss="modal"]`).click();

    await page.locator(locator).waitFor({ state: 'hidden' });

    await expect(page.locator(locator)).toBeHidden();
};

test('test-modals - #c4bModalPerpetualPricing', async ({ page }) => {
    await testModal(page, '#c4bModalPerpetualPricing', true);
});

test('test-modals - #c4bModalNonProfitPricing', async ({ page }) => {
    await testModal(page, '#c4bModalNonProfitPricing', true);
});

test('test-modals - #c4bModalPackaging', async ({ page }) => {
    await testModal(page, '#c4bModalPackaging', false);
});

test('test-modals - #c4bModalResponseTimes', async ({ page }) => {
    await testModal(page, '#c4bModalResponseTimes', false);
});

test('test-modals - #c4bModalSupportType', async ({ page }) => {
    await testModal(page, '#c4bModalSupportType', false);
});
