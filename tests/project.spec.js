const { test, expect } = require('@playwright/test');

const testProject={
    title:"playwright",
    desciption:"playwright Test",
    importance:"playwright importance",
    starts:'2024-03-10',
    deadline:'2024-03-20'
}

const testUser={
    name:'playwright User',
    surname:'playwright last',
    title:'playwright title'
}

test('has title', async ({ page }) => {
    await page.goto('http://localhost:3001');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Project App/);
});

test.describe('Test Project App', () => {

    test('add user', async({page})=>{
        await page.goto('http://localhost:3001');
        await page.getByRole('link', { name: 'Add User' }).click();
        await page.getByLabel('Name', { exact: true }).fill(testUser.name);
        await page.getByLabel('Lastname').fill(testUser.surname);
        await page.getByLabel('Title').fill(testUser.title);
        await page.getByRole('button', { name: 'Add User' }).click();
    });

    test('add project and check project list', async({page})=>{
        await page.goto('http://localhost:3001');

        //count project items
        const projectCount = await page.getByRole('cell', { name: 'Remove' }).count();

        //Add project
        await page.getByText('Add Project').click();
        await page.getByLabel('title').fill(testProject.title);
        await page.getByLabel('Description').fill(testProject.desciption);
        await page.getByLabel('Importance').fill(testProject.importance);
        await page.locator('#startingDate').fill(testProject.starts);
        await page.waitForTimeout(2000);
        await page.getByLabel('Deadline').fill(testProject.deadline);
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Users' }).click();

        //check user added
        await page.getByRole('button', { name: testUser.name }).first().click();
        await page.waitForTimeout(2000);
        await page.getByRole('button', { name: 'Add Project' }).click();

        //recount project items
        const afterCount = await page.getByRole('cell', { name: 'Remove' }).count();
        //expect to increase
        expect(afterCount).toBeGreaterThan(projectCount);
    });

    test('remove project', async({page})=>{
        await page.goto('http://localhost:3001');

        //count project items
        const projectCount = await page.getByRole('cell', { name: 'Remove' }).count();

        if(projectCount>0){
            await page.getByRole('button', { name: 'Remove' }).first().click();
            //recount project items
            const afterCount = await page.getByRole('cell', { name: 'Remove' }).count();
            expect(afterCount).toBeLessThan(projectCount);
        }
    })
})