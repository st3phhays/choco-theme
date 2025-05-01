export const testBaseline = async (test, expect): Promise<void> => {
    test('baseline', async ({ page }) => {
        await page.goto('./');
    
        // Expect a title "to contain" a substring.
        await expect(page).toHaveTitle(/Chocolatey/);

        console.log('Baseline test completed successfully.');
    });
};
