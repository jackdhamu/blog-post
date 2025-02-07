import React from 'react'
import { Layout, Menu } from 'antd'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  HomeOutlined,
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  PlusOutlined
} from '@ant-design/icons'
import { logoutUser } from '../../store/slices/authSlice'
import styles from './Navigation.module.scss'

const { Header } = Layout

const Navigation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap()
      navigate('/login')
    } catch (error) {
      // Error is handled by the slice
    }
  }

  const publicItems = [
    {
      key: '/login',
      icon: <LoginOutlined />,
      label: <Link to="/login">Login</Link>
    },
    {
      key: '/signup',
      icon: <UserOutlined />,
      label: <Link to="/signup">Sign Up</Link>
    }
  ]

  const privateItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>
    },
    {
      key: '/posts/create',
      icon: <PlusOutlined />,
      label: <Link to="/posts/create">Create Post</Link>
    },
    {
      key: '/authors',
      icon: <UserOutlined />,
      label: <Link to="/authors">Authors</Link>
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout
    }
  ]

  return (
    <Header className={styles.header}>
      <div className={styles.logo}>Blog App</div>
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={isAuthenticated ? privateItems : publicItems}
      />
    </Header>
  )
}

export default Navigation 