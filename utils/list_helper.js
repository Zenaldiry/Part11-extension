const _ = require('lodash')
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sumOfLikes = _.sumBy(blogs, 'likes')
  return sumOfLikes
}

const favoriteBlog = (blogs) => {
  const favorite = _.maxBy(blogs, 'likes')
  return favorite
}

const mostBlogs = (authores) => {
  const mostBlogs = _.maxBy(authores, 'blogs')
  return mostBlogs
}
const mostLikes = (authores) => {
  const mostLikes = _.maxBy(authores, 'likes')
  return mostLikes
}
module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
