const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)
const User = require('../models/user')
const { test, describe, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const assert = require('node:assert')
const { initialUser, usersInDB } = require('./test_helper')
beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(initialUser)
})
describe('getting users', () => {
  test('blogs returns correctly with get', async () => {
    const users = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    assert.strictEqual(users.body.length, initialUser.length)
  })
})

describe('adding users', () => {
  test('adding user will return 201 status code and added succesfully', async () => {
    const user = {
      name: 'willadded',
      username: 'willadded',
      password: 'willadded',
    }
    await api.post('/api/users').send(user).expect(201)
    const usersAfterAdd = await usersInDB()
    assert.strictEqual(usersAfterAdd.length, initialUser.length + 1)
  })
  test('adding user not unique will return error with status code 400', async () => {
    const user = {
      name: 'tete',
      username: 'tete',
      password: 'tete',
    }
    await api.post('/api/users').send(user).expect(400)
    const users = await usersInDB()
    assert.strictEqual(initialUser.length, users.length)
  })

  test('adding user with less than 3 characters will return error 400', async () => {
    const user = {
      name: 'lessThan3',
      username: '12',
      password: 'onetwo',
    }
    await api.post('/api/users').send(user).expect(400)
    const users = await usersInDB()
    const shouldTrue = users.length === initialUser.length ? true : false
    assert.strictEqual(shouldTrue, true)
  })

  test('adding user without username will return error with status 400', async () => {
    const user = {
      name: 'noUsername',
      password: 'noUername',
    }
    await api.post('/api/users').send(user).expect(400)
    const users = await usersInDB()
    const shouldTrue = users.length === initialUser.length ? true : false
    assert.strictEqual(shouldTrue, true)
  })
  test('adding user without password will return error with status 400', async () => {
    const user = {
      name: 'noUsername',
      username: 'noUername',
    }
    await api.post('/api/users').send(user).expect(400)
    const users = await usersInDB()
    assert.strictEqual(initialUser.length, users.length)
  })
})
after(async () => {
  await mongoose.connection.close()
})
