import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { List, Card, Button, Space, Select, message, Modal } from 'antd'
import { LikeOutlined, LikeFilled, EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router-dom'
import { 
  fetchPosts, 
  deletePost, 
  likePost, 
  unlikePost, 
  setFilters
} from '../../store/slices/postsSlice'
import { getCurrentUser } from '../../store/slices/authSlice'
import PostForm from './PostForm'
import styles from './PostsList.module.scss'

const { Option } = Select

const PostsList = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items: posts, isLoading, filters } = useSelector((state) => state.posts)
  const { user } = useSelector((state) => state.auth)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingPost, setEditingPost] = useState(null)

  useEffect(() => {
    if (!user && localStorage.getItem('token')) {
      dispatch(getCurrentUser())
    }
    dispatch(fetchPosts(filters))
  }, [dispatch, filters, user])

  const isPostOwner = (post) => {
    return user?.id === post.user.id
  }

  const handleDelete = async (postId) => {
    try {
      await dispatch(deletePost(postId)).unwrap()
      message.success('Post deleted successfully')
    } catch (error) {
      message.error(error || 'Failed to delete post')
    }
  }

  const handleLikeToggle = async (post) => {
    try {
      if (post.is_liked) {
        await dispatch(unlikePost(post.id)).unwrap()
        message.success('Post unliked')
      } else {
        await dispatch(likePost(post.id)).unwrap()
        message.success('Post liked')
      }
    } catch (error) {
      message.error(error || 'Failed to toggle like')
    }
  }

  const handleSortChange = (value) => {
    dispatch(setFilters({ sort: value }))
  }

  const handleFilterChange = (value) => {
    dispatch(setFilters({ mine: value === 'mine' }))
  }

  const handleCreateClick = () => {
    setEditingPost(null)
    setModalVisible(true)
  }

  const handleEditClick = (post) => {
    setEditingPost(post)
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setEditingPost(null)
  }

  return (
    <div className={styles.postsContainer}>
      <div className={styles.controls}>
        <Space>
          <Select
            defaultValue="all"
            value={filters.mine ? 'mine' : 'all'}
            onChange={handleFilterChange}
            className={styles.filterSelect}
          >
            <Option value="all">All Posts</Option>
            <Option value="mine">My Posts</Option>
          </Select>
          <Select
            value={filters.sort}
            onChange={handleSortChange}
            className={styles.sortSelect}
          >
            <Option value="created_at">Latest</Option>
            <Option value="likes_count">Most Liked</Option>
          </Select>
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreateClick}
          >
            Create Post
          </Button>
        </Space>
      </div>

      <List
        grid={{ gutter: 16, column: 1 }}
        dataSource={posts}
        loading={isLoading}
        renderItem={(post) => (
          <List.Item>
            <Card
              className={styles.postCard}
              actions={[
                <Button
                  key="like"
                  icon={post.is_liked ? <LikeFilled /> : <LikeOutlined />}
                  onClick={() => handleLikeToggle(post)}
                  disabled={isPostOwner(post)}
                  type={post.is_liked ? 'primary' : 'default'}
                >
                  {post.likes_count}
                </Button>,
                isPostOwner(post) && (
                  <Button
                    key="edit"
                    icon={<EditOutlined />}
                    onClick={() => handleEditClick(post)}
                  >
                    Edit
                  </Button>
                ),
                isPostOwner(post) && (
                  <Button
                    key="delete"
                    icon={<DeleteOutlined />}
                    danger
                    onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </Button>
                )
              ].filter(Boolean)}
            >
              <Card.Meta
                title={<Link to={`/posts/${post.id}`}>{post.title}</Link>}
                description={
                  <>
                    <p className={styles.postPreview}>
                      {post.content.length > 200 
                        ? `${post.content.slice(0, 200)}...` 
                        : post.content}
                    </p>
                    <p className={styles.postMeta}>
                      By{' '}
                      <Link to={`/authors/${post.user.id}`}>{post.user.name}</Link>
                    </p>
                  </>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title={editingPost ? 'Edit Post' : 'Create Post'}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        <PostForm
          initialValues={editingPost}
          onSuccess={handleModalClose}
        />
      </Modal>
    </div>
  )
}

export default PostsList 