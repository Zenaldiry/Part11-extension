const login = async (page, username, password) => {
  await page.getByRole('button', { name: 'login' }).click();
  await page.getByRole('textbox', { name: 'username' }).fill(username);
  await page.getByRole('textbox', { name: 'password' }).fill(password);
  await page.getByRole('button', { name: 'login' }).click();
};

const createBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: 'new note' }).click();
  await page.getByRole('textbox', { name: 'title' }).fill(title);
  await page.getByRole('textbox', { name: 'author' }).fill(author);
  await page.getByRole('textbox', { name: 'url' }).fill(url);
  await page.getByRole('button', { name: 'create' }).click();
  await page
    .locator('#title-author')
    .getByText(`${title} by ${author}`)
    .waitFor();
};
const likeBlog = async (blog, like) => {
  await blog.getByRole('button', { name: 'view' }).click();
  await blog.getByRole('button', { name: 'like' }).click();
  await blog.locator('#likes').getByText(like).waitFor();
  await blog.getByRole('button', { name: 'hide' }).click();
};

module.exports = { login, createBlog, likeBlog };
