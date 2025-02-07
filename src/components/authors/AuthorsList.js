import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { List, Card, Avatar, Spin } from 'antd'
import { Link } from 'react-router-dom'
import { fetchAuthors } from '../../store/slices/authorsSlice'
import { UserOutlined } from '@ant-design/icons'
import styles from './AuthorsList.module.scss'

const AuthorsList = () => {
  const dispatch = useDispatch()
  const { items: authors, isLoading } = useSelector((state) => state.authors)

  useEffect(() => {
    dispatch(fetchAuthors())
  }, [dispatch])

  return (
    <div className={styles.authorsContainer}>
      <h1>Authors</h1>
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }}
        dataSource={authors}
        loading={isLoading}
        renderItem={(author) => (
          <List.Item>
            <Link to={`/authors/${author.id}`}>
              <Card hoverable className={styles.authorCard}>
                <Card.Meta
                  avatar={
                    <Avatar
                      size={64}
                      icon={<UserOutlined />}
                      src={author.avatar}
                    />
                  }
                  title={author.name}
                  description={`${author.postsCount} posts`}
                />
              </Card>
            </Link>
          </List.Item>
        )}
      />
    </div>
  )
}

export default AuthorsList 