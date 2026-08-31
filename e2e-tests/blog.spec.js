const { test, describe, beforeEach, expect } = require('@playwright/test');
const { login, createBlog, likeBlog } = require('./test_helper');
describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click();
    const username = await page.getByRole('textbox', { name: 'username' });
    const password = await page.getByRole('textbox', { name: 'password' });
    const loginBtn = await page.getByRole('button', { name: 'login' });
    await expect(username).toBeVisible();
    await expect(password).toBeVisible();
    await expect(loginBtn).toBeVisible();
  });
  describe('test login', () => {
    beforeEach(async ({ page, request }) => {
      const newUser = {
        name: 'test',
        username: 'test',
        password: 'test',
      };
      await request.post('/api/testing/reset');
      await request.post('/api/users', {
        data: newUser,
      });
      await page.reload();
    });
    test('sucessful login', async ({ page }) => {
      await login(page, 'test', 'test');
      await expect(
        await page.locator('#loginHeading').getByText('test Logged in')
      ).toBeVisible();
    });
    test('failed login', async ({ page }) => {
      await login(page, 'test', 'wrong');
      await expect(
        await page.getByText('invalid username or password')
      ).toBeVisible();
    });
    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await login(page, 'test', 'test');
      });

      test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'the title', 'the author', 'the url');
        expect(
          await page
            .locator('#title-author')
            .getByText('the title by the author')
        ).toBeVisible();
      });
      describe('when blog existed', () => {
        beforeEach(async ({ page, request }) => {
          const newBlog = {
            title: 'this to test like',
            author: 'zen',
            url: 'zen.com',
            user: {
              username: 'test',
            },
          };
          const anotherUser = {
            name: 'anotherUser',
            username: 'anotherUser',
            password: 'anotherUser',
          };
          await request.post('/api/users', {
            data: anotherUser,
          });
          await createBlog(page, newBlog.title, newBlog.author, newBlog.url);
        });
        test('blog can be liked', async ({ page }) => {
          await page.getByRole('button', { name: 'view' }).click();
          await expect(page.locator('#likes')).toHaveText('0');
          await page.getByRole('button', { name: 'like' }).click();
          await expect(page.locator('#likes')).toHaveText('1');
        });
        test('user who created blog can delete it', async ({ page }) => {
          const blog = await page
            .locator('#title-author')
            .getByText('this to test like by zen');
          await expect(blog).toBeVisible();
          await page.getByRole('button', { name: 'view' }).click();
          const userName = await page.locator('#userName').textContent();
          await expect(page.locator('#loginHeading')).toContainText(
            `${userName} Logged in`
          );
          page.once('dialog', async (dialog) => {
            await dialog.accept();
          });
          await page.getByRole('button', { name: 'remove' }).click();
          await expect(blog).not.toBeVisible();
        });
        test('only who created blog can see remove button', async ({
          page,
        }) => {
          await page.getByRole('button', { name: 'view' }).click();
          await expect(
            page.getByRole('button', { name: 'remove' })
          ).toBeVisible();
          await page.getByRole('button', { name: 'Logout' }).click();
          await login(page, 'anotherUser', 'anotherUser');
          await page.getByRole('button', { name: 'view' }).click();
          await expect(
            page.getByRole('button', { name: 'remove' })
          ).not.toBeVisible();
        });
      });
      describe('when three blogs existed', () => {
        beforeEach(async ({ page }) => {
          await createBlog(page, 'first blog', 'first author', 'first url');
          await createBlog(page, 'second blog', 'second author', 'second url');
          await createBlog(page, 'third blog', 'third author', 'third url');
        });
        test('the blogs are sorted by likes the most likes first', async ({
          page,
        }) => {
          const firstBlog = await page
            .locator('#blog')
            .filter({ hasText: 'first blog' });
          const secondBlog = await page
            .locator('#blog')
            .filter({ hasText: 'second blog' });
          const thirdBlog = await page
            .locator('#blog')
            .filter({ hasText: 'third blog' });
          await likeBlog(firstBlog, '1');
          await likeBlog(secondBlog, '1');
          await likeBlog(secondBlog, '2');
          await likeBlog(thirdBlog, '1');
          await likeBlog(thirdBlog, '2');
          await likeBlog(thirdBlog, '3');
          const likesLocator = page.locator('#likes');
          const texts = await likesLocator.allTextContents();
          const counts = texts.map((t) => Number(t));
          const sorted = [...counts].sort((a, b) => b - a);
          expect(counts).toEqual(sorted);
        });
      });
    });
  });
});
