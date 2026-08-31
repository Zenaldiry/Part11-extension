import { useState } from 'react'
import PropTypes from 'prop-types'
const BlogForm = ({ createNote }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const handleCreate = async (e) => {
    e.preventDefault()
    const blogToCreate = {
      title,
      author,
      url,
    }
    await createNote(blogToCreate)
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <form onSubmit={handleCreate}>
      <div>
        <label htmlFor="title">title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={({ target }) => {
            setTitle(target.value)
          }}
        />
      </div>
      <div>
        <label htmlFor="author">author</label>
        <input
          type="text"
          id="author"
          value={author}
          onChange={({ target }) => {
            setAuthor(target.value)
          }}
        />
      </div>
      <div>
        <label htmlFor="url">url</label>
        <input
          type="text"
          id="url"
          value={url}
          onChange={({ target }) => {
            setUrl(target.value)
          }}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )
}
BlogForm.propTypes = {
  createNote: PropTypes.func.isRequired,
}
export default BlogForm
