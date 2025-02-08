import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Button, Space, Select, message, Modal } from 'antd'
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
    dispatch(fetchPosts({ ...filters, sort: value }))
  }

  const handleFilterChange = (value) => {
    dispatch(setFilters({ mine: value === 'mine' }))
    dispatch(fetchPosts({ ...filters, mine: value === 'mine' }))
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

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (text, post) => <Link to={`/posts/${post.id}`}>{text}</Link>
    },
    {
      title: 'Content',
      dataIndex: 'content',
      key: 'content',
      render: (text) => (
          <p className={styles.postPreview}>
            {text.length > 200 ? `${text.slice(0, 200)}...` : text}
          </p>
      )
    },
    {
      title: 'Author',
      dataIndex: ['user', 'name'],
      key: 'author',
      render: (text, post) => <Link to={`/authors/${post.user.id}`}>{text}</Link>
    },
    {
      title: 'Likes',
      dataIndex: 'likes_count',
      key: 'likes_count',
      render: (likes_count, post) => (
          <Button
              icon={post.is_liked ? <LikeFilled /> : <LikeOutlined />}
              onClick={() => handleLikeToggle(post)}
              disabled={isPostOwner(post)}
              type={post.is_liked ? 'primary' : 'default'}
          >
            {likes_count}
          </Button>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, post) => (
          <Space>
            {isPostOwner(post) && (
                <>
                  <Button
                      icon={<EditOutlined />}
                      onClick={() => handleEditClick(post)}
                  >
                    Edit
                  </Button>
                  <Button
                      icon={<DeleteOutlined />}
                      danger
                      onClick={() => handleDelete(post.id)}
                  >
                    Delete
                  </Button>
                </>
            )}
          </Space>
      )
    }
  ]

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

        <Table
            columns={columns}
            dataSource={posts}
            loading={isLoading}
            rowKey="id"
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