import React, { useEffect } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser, clearError } from '../../store/slices/authSlice'
import styles from './Login.module.scss'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
    return () => {
      dispatch(clearError())
    }
  }, [isAuthenticated, navigate, dispatch])

  const onFinish = async (values) => {
    try {
      await dispatch(loginUser(values)).unwrap()
      message.success('Login successful!')
    } catch (err) {
      if (typeof err === 'string') {
        message.error(err)
      } else {
        message.error('Login failed')
      }
    }
  }

  return (
    <div className={styles.loginContainer}>
      <Card title="Login" className={styles.loginCard}>
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            validateStatus={error?.email ? 'error' : ''}
            help={error?.email?.[0]}
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            validateStatus={error?.password ? 'error' : ''}
            help={error?.password?.[0]}
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>

          {error && typeof error === 'string' && (
            <div className={styles.errorMessage}>{error}</div>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} block>
              Login
            </Button>
          </Form.Item>

          <div className={styles.signupLink}>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Login 