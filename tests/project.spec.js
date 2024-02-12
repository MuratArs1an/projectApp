const { test, expect } = require('@playwright/test');
const axios = require('axios');

//get all users from database
const fetchAllUsers = async () => {
    try {
        const response = await axios.get('http://localhost:3000/users');
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
};

//get today with yyyy-mm-dd format
const currentDate=()=>{
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

//get 10 day after today with yyyy-mm-dd format
const deadlineDate=()=>{
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()+10).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
}

//create random string
function randomString(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

//for adding all users
const users=[]

//random test project object
const testProject={
    title:String(Date.now()),
    desciption:String(Date.now()*2),
    importance:String(Math.random()*1000),
    starts: currentDate(),
    deadline: deadlineDate()
} 

//random test user object
const testUser={
    name:randomString(5),
    surname:randomString(6),
    title:randomString(7)
}

test('has title', async ({ page }) => {
    await page.goto('http://localhost:3001');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Project App/);
});

test.describe('Test Project App', () => {

    //refresh user before all test
    test.beforeEach(async () => {
        const fetchedUsers = await fetchAllUsers();
        users.push(...fetchedUsers);
    });

    test('add user', async({page})=>{
        await page.goto('http://localhost:3001');
        await page.getByRole('link', { name: 'Add User' }).click();
        await page.getByLabel('Name', { exact: true }).fill(testUser.name);
        await page.getByLabel('Lastname').fill(testUser.surname);
        await page.getByLabel('Title').fill(testUser.title);
        await page.getByRole('button', { name: 'Add User' }).click();

        users.push(testUser);
    });

    test('add project and check project list', async({page})=>{

        const fetchedUsers = await fetchAllUsers();
        users.push(...fetchedUsers);

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
        if (users.length > 0) {
            const randomUser=Math.floor((Math.random() * (users.length+1))) 
            await page.getByRole('button', { name: users[randomUser].name }).click();
            await page.waitForTimeout(2000);

            await page.getByRole('button', { name: 'Add Project' }).click();
        }

        await page.goto('http://localhost:3001');

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