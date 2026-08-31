const mongoose = require('mongoose')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const { describe, test, after, beforeEach, before } = require('node:test')
const assert = require('node:assert')
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, blogsInDB } = require('../tests/test_helper')

describe('when blogs added initially ', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
  })
  describe('getting blogs', () => {
    test('blogs returns correctly with get', async () => {
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogs = await blogsInDB()
      assert.strictEqual(initialBlogs.length, blogs.length)
    })

    test('the unique identifier property of the blog posts is named id', async () => {
      const id = initialBlogs[0]._id
      const blog = await api.get(`/api/blogs/${id}`)
      assert.strictEqual(blog.body.id, id)
      assert.strictEqual(blog.body._id, undefined)
    })
  })
  describe('adding blogs', () => {
    let token
    before(async () => {
      const user = {
        name: 'one',
        username: 'one',
        password: 'one',
      }
      await api.post('/api/users').send(user)
      const loginRes = await api
        .post('/api/login')
        .send({ username: user.username, password: user.password })
      token = loginRes.body.token
    })
    test('making an HTTP POST request to the /api/blogs URL successfully creates a new blog post', async () => {
      const blogToAdd = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
      }
      await api
        .post('/api/blogs')
        .send(blogToAdd)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
    })
    test('making post request to /api/blogs without authorization header will return error 401', async () => {
      const blogToAdd = {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
      }
      await api.post('/api/blogs').send(blogToAdd).expect(401)
    })
    test(' if the likes property is missing from the request, it will default to the value 0', async () => {
      const blogToAddWithoutLikes = {
        title: 'the likes should be zero',
        author: 'no author',
        url: 'http://www.nourl.com.html',
      }

      await api
        .post('/api/blogs')
        .send(blogToAddWithoutLikes)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)

      const blogsAfterAdd = await blogsInDB()
      const addedBlog = blogsAfterAdd.find((blog) => {
        return blog.title === 'the likes should be zero'
      })
      assert.strictEqual(addedBlog.likes, 0)
    })
    test('if the url properties are missing the backend responds with the status code 400 Bad Request', async () => {
      const blogWithoutUrl = {
        title: 'the likes should be zero',
        author: 'no author',
      }
      await api
        .post('/api/blogs')
        .send(blogWithoutUrl)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
      const blogsAfter = await blogsInDB()
      assert.strictEqual(blogsAfter.length, initialBlogs.length)
    })
    test('if the title properties are missing the backend responds with the status code 400 Bad Request', async () => {
      const blogWithoutTitle = {
        url: 'http://www.nourl.com.html',
        author: 'no author',
      }
      await api
        .post('/api/blogs')
        .send(blogWithoutTitle)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
      const blogsAfter = await blogsInDB()
      assert.strictEqual(blogsAfter.length, initialBlogs.length)
    })
  })
  describe('deleting blogs', () => {
    let token
    let blog
    beforeEach(async () => {
      await User.deleteMany({})
      const user = {
        name: 'two',
        username: 'two',
        password: 'two',
      }
      await api.post('/api/users').send(user)
      const loginRes = await api
        .post('/api/login')
        .send({ username: user.username, password: user.password })
      token = loginRes.body.token
    })
    test('when delete blog return 200 and the blog got deleted', async () => {
      const toAdd = {
        title: 'toDelete',
        author: 'me',
        url: 'http://me.com/.html',
        likes: 2,
      }
      blog = await api
        .post('/api/blogs')
        .send(toAdd)
        .set('Authorization', `Bearer ${token}`)
      const id = blog._body.id
      await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)
      await api.get(`/api/blogs/${id}`).expect(404)
    })
    test('delete fails with 401 status code if token not provided', async () => {
      const newBlog = {
        title: 'this should be deleted',
        author: 'zen aldiry',
        url: 'https://test.zen.com',
        likes: 99,
      }

      const saved = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
      const blogs = await blogsInDB()
      assert.strictEqual(blogs.length, initialBlogs.length + 1)
      await api.delete(`/api/blogs/${saved._body.id}`).expect(401)
      const notesAfterDelete = await blogsInDB()
      assert.strictEqual(notesAfterDelete.length, initialBlogs.length + 1)
    })

    test('deleting blog by user who did not create it will return 401 status code Unauthorized', async () => {
      const toAdd = {
        title: 'wihtAnotheruser',
        author: 'me',
        url: 'http://me.com/.html',
        likes: 32,
      }
      blog = await api
        .post('/api/blogs')
        .send(toAdd)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
      const id = blog._body.id
      const anotherUser = {
        name: 'anotheruser',
        username: 'anotheruser',
        password: 'anotheruser',
      }
      await api.post('/api/users').send(anotherUser)
      const anotherLogin = await api.post('/api/login').send({
        username: anotherUser.username,
        password: anotherUser.password,
      })
      const anotherToken = anotherLogin.body.token
      await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', `Bearer ${anotherToken}`)
        .expect(400)
    })

    test('updating blogs likes will return 200 and the likes get updated', async () => {
      const toAdd = {
        title: 'toDelete',
        author: 'me',
        url: 'http://me.com/.html',
        likes: 2,
      }
      blog = await api
        .post('/api/blogs')
        .send(toAdd)
        .set('Authorization', `Bearer ${token}`)
      const id = blog._body.id
      const updateLikes = {
        likes: 999,
      }
      await api
        .put(`/api/blogs/${id}`)
        .send(updateLikes)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
      const blogsAfterUpdate = await blogsInDB()
      const updated = blogsAfterUpdate.find((blog) => {
        return blog.id === id
      })
      assert.strictEqual(updated.likes, 999)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})
