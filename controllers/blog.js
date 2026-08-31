const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const { tokenExtractor, userExtractor } = require('../utils/middlewares')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
  })
  response.json(blogs)
})

blogRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const blog = await Blog.findById(id).populate('user', {
    username: 1,
    name: 1,
  })
  if (!blog) {
    return response.status(404).json({ error: 'not found' })
  }
  response.json(blog)
})

blogRouter.post(
  '/',
  tokenExtractor,
  userExtractor,
  async (request, response) => {
    const body = request.body
    if (
      !body.title ||
      body.title.trim() === '' ||
      body.url === '' ||
      !body.url
    ) {
      return response
        .status(400)
        .json({ error: 'the title or url is missing' })
    }
    const user = request.user
    if (!user) {
      return response
        .status(400)
        .json({ error: 'UserId missing or not valid' })
    }

    const newBlog = new Blog({ ...body, user: user.id })
    const savedBlog = await newBlog.save()
    user.blogs = user.blogs.concat(newBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
  }
)

blogRouter.delete(
  '/:id',
  tokenExtractor,
  userExtractor,
  async (request, response) => {
    const id = request.params.id
    const blog = await Blog.findById(id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    const user = request.user
    if (!user) {
      return response.status(401).json({ error: 'unauthorized ' })
    }
    if (blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndDelete(id)
    } else {
      return response
        .status(400)
        .json({ error: 'deleting is allowed only for user' })
    }
    response.status(204).end()
  }
)

blogRouter.put(
  '/:id',
  tokenExtractor,
  userExtractor,
  async (request, response) => {
    const id = request.params.id
    const updatedBlog = request.body
    const blog = await Blog.findById(id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    const user = request.user
    if (!user) {
      return response.status(401).json({ error: 'unauthorized ' })
    }
    if (blog.user.toString() === user.id.toString()) {
      const finalUpdate = await Blog.findByIdAndUpdate(id, updatedBlog, {
        new: true,
      }).populate('user', {
        username: 1,
        name: 1,
      })
      return response.status(200).json(finalUpdate)
    } else {
      return response.status(400).json({
        error: 'updating is allowed only for user who created the blog',
      })
    }
  }
)

blogRouter.delete('/', async (request, response) => {
  await Blog.deleteMany({})
  response.status(204).end()
})
module.exports = blogRouter
