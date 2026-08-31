import { beforeEach, describe, expect, test, vi } from 'vitest'
import Blog from './Blog'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
describe('Blog', () => {
  const blog = {
    title: 'blog title',
    author: 'blog author',
    url: 'test2.com',
    likes: 1,
    user: {
      name: 'zen',
    },
  }
  const user = {
    name: 'zen',
    username: 'zen',
  }
  let container
  const handleLikes = vi.fn()
  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        user={user}
        handleDelete={() => {}}
        handleLikes={handleLikes}
      />
    ).container
  })
  test('displaying a blog renders the blogs title and author and does not display others', () => {
    const titleAndAuthor = screen.getByText(`${blog.title} by ${blog.author}`)
    expect(titleAndAuthor).toBeVisible()
    const blogDetails = screen.queryByTestId('blogDetails')
    expect(blogDetails).not.toBeVisible()
  })
  test('blog URL and number of likes are shown when the button clicked', async () => {
    const blogDetails = screen.queryByTestId('blogDetails')
    expect(blogDetails).not.toBeVisible()
    const viewBtn = screen.getByRole('button', { name: 'view' })
    const user = userEvent.setup()
    await user.click(viewBtn)
    expect(blogDetails).toBeVisible()
    expect(blogDetails.querySelector('#url')).toBeVisible()
    expect(blogDetails.querySelector('#likes')).toBeVisible()
    expect(blogDetails.querySelector('#userName')).toBeVisible()
  })
  test('if the like button is clicked twice, the event handler received as props is called twice.', async () => {
    const viewBtn = screen.getByRole('button', { name: 'view' })
    const user = userEvent.setup()
    await user.click(viewBtn)
    const likeBtn = screen.getByRole('button', { name: 'like' })
    await user.click(likeBtn)
    await user.click(likeBtn)
    expect(handleLikes.mock.calls).toHaveLength(2)
  })
})
