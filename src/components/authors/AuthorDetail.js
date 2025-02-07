import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Card, Avatar, Button, List, message, Popconfirm } from 'antd'
import { UserOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { fetchAuthor, deleteAuthor } from '../../store/slices/authorsSlice'
import { fetchPosts } from '../../store/slices/postsSlice'
import PostsList from '../posts/PostsList'
import styles from './AuthorDetail.module.scss'

const AuthorDetail = () => {
  const { authorId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentAuthor, isLoading } = useSelector((state) => state.authors)
  const { user } = useSelector((state) => state.auth)
  const isOwnProfile = user?.id === currentAuthor?.id

  useEffect(() => {
    dispatch(fetchAuthor(authorId))
    dispatch(fetchPosts({ authorId }))
  }, [dispatch, authorId])

  const handleDelete = async () => {
    try {
      await dispatch(deleteAuthor(authorId)).unwrap()
      message.success('Profile deleted successfully')
      navigate('/')
    } catch (error) {
      message.error('Failed to delete profile')
    }
  }

  if (!currentAuthor && !isLoading) {
    return <div>Author not found</div>
  }

  return (
    <div className={styles.authorDetailContainer}>
      <Card loading={isLoading}>
        <Card.Meta
          avatar={
            <Avatar
              size={96}
              icon={<UserOutlined />}
              src={currentAuthor?.avatar}
            />
          }
          title={
            <div className={styles.authorHeader}>
              <h1>{currentAuthor?.name}</h1>
              {isOwnProfile && (
                <div className={styles.actions}>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => navigate(`/authors/${authorId}/edit`)}
                  >
                    Edit Profile
                  </Button>
                  <Popconfirm
                    title="Are you sure you want to delete your profile?"
                    onConfirm={handleDelete}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button icon={<DeleteOutlined />} danger>
                      Delete Profile
                    </Button>
                  </Popconfirm>
                </div>
              )}
            </div>
          }
          description={
            <div className={styles.authorInfo}>
              <p>{currentAuthor?.email}</p>
              <p>{currentAuthor?.bio}</p>
              <div className={styles.stats}>
                <span>Total Posts: {currentAuthor?.postsCount}</span>
                <span>Total Likes: {currentAuthor?.totalLikes}</span>
              </div>
            </div>
          }
        />
      </Card>

      <div className={styles.authorPosts}>
        <h2>Posts by {currentAuthor?.name}</h2>
        <PostsList authorId={authorId} />
      </div>
    </div>
  )
}

export default AuthorDetail 