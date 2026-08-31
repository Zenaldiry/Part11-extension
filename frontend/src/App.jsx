import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import ToggLable from './components/ToggLable'
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')
  const [color, setColor] = useState(true)
  const blogFormRef = useRef()
  const createNote = async (blogToCreate) => {
    const newBlog = await blogService.create(blogToCreate, user.token)
    setBlogs([...blogs, { ...newBlog, user: { username: user.username } }])
    blogFormRef.current.toggleVisible()
    setNotification(`a new blog ${newBlog.title} by ${newBlog.author} added `)
    setColor(true)
    setTimeout(() => {
      setNotification('')
    }, 3000)
  }
  const handleLikes = async ({ target }) => {
    const id = target.id
    const likesOfBlog = blogs.find((blog) => {
      return blog.id === id
    }).likes
    const newLikes = {
      likes: likesOfBlog + 1,
    }
    const newBlog = await blogService.update(id, newLikes, user.token)
    const newBlogs = blogs.map((blog) => {
      return blog.id === id ? newBlog : blog
    })
    setBlogs(newBlogs)
  }
  const handleDelete = async ({ target }) => {
    const id = target.id
    const blogToDelete = blogs.find((blog) => {
      return blog.id === id
    })
    const confirmDialog = confirm(
      `Remove ${blogToDelete.title}  by ${blogToDelete.author}`
    )
    if (confirmDialog) {
      await blogService.deleteOne(id, user.token)
      const blogsAfterDelete = blogs.filter((blog) => {
        return blog.id !== id
      })
      setBlogs(blogsAfterDelete)
    }
  }
  const handleLogout = () => {
    window.localStorage.clear()
    setUser(null)
  }
  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])
  useEffect(() => {
    const userFromLocal = window.localStorage.getItem('loggedBlogUser')
    setUser(JSON.parse(userFromLocal))
  }, [])
  return (
    <div>
      <Notification notification={notification} color={color} />
      {user === null ? (
        <LoginForm
          setUser={setUser}
          setNotification={setNotification}
          setColor={setColor}
        />
      ) : (
        <>
          <h2>blogs</h2>
          <h3 id="loginHeading">
            {user.name} Logged in <button onClick={handleLogout}>Logout</button>
          </h3>
          <div>
            <h2>Create new</h2>
            <ToggLable buttonLable="new note" ref={blogFormRef}>
              <BlogForm createNote={createNote} />
            </ToggLable>
          </div>
          <div id="blogs">
            {blogs
              .sort((a, b) => {
                return b.likes - a.likes
              })
              .map((blog) => (
                <Blog
                  key={blog.id}
                  blog={blog}
                  handleLikes={handleLikes}
                  user={user}
                  handleDelete={handleDelete}
                />
              ))}
          </div>
        </>
      )}
    </div>
  )
}

export default App
