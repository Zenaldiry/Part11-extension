import ToggBtn from './ToggBtn'
import PropTypes from 'prop-types'
const Blog = ({ blog, handleLikes, user, handleDelete }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const removeBtnStyle = {
    backgroundColor: 'red',
  }
  return (
    <div style={blogStyle} id="blog">
      <span id="title-author">
        {blog.title} by {blog.author}{' '}
      </span>
      <ToggBtn show="view" hide="hide">
        <div data-testid="blogDetails">
          <div id="url">{blog.url}</div>
          <div>
            <span id="likes">{blog.likes}</span>
            <button id={blog.id} onClick={handleLikes}>
              like
            </button>
          </div>
          <div id="userName">{blog.user.username}</div>
          {user.username === blog.user.username && (
            <button onClick={handleDelete} id={blog.id} style={removeBtnStyle}>
              remove
            </button>
          )}
        </div>
      </ToggBtn>
    </div>
  )
}
Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  handleLikes: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
}

export default Blog
