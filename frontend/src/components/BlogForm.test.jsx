import { beforeEach, describe, expect, test, vi } from 'vitest'
import BlogForm from './BlogForm'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
describe('BlogForm', () => {
  const createNote = vi.fn()
  beforeEach(() => {
    render(<BlogForm createNote={createNote} />)
  })
  test('calls event handler with right details when a new blog is created', async () => {
    const user = userEvent.setup()
    const blogToAdd = {
      title: 'this is blog title',
      author: 'blog author',
      url: 'blogUrl.com',
    }
    const titleField = screen.getByRole('textbox', { name: 'title' })
    const authorField = screen.getByRole('textbox', { name: 'author' })
    const urlField = screen.getByRole('textbox', { name: 'url' })
    await user.type(titleField, blogToAdd.title)
    await user.type(authorField, blogToAdd.author)
    await user.type(urlField, blogToAdd.url)
    const submitBtn = screen.getByRole('button', { name: 'create' })
    await user.click(submitBtn)
    expect(createNote.mock.calls[0][0]).toEqual(blogToAdd)
  })
})
