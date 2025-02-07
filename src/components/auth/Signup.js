import React, { useEffect } from 'react'
import { Form, Input, Button, Card, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { signupUser, clearError } from '../../store/slices/authSlice'
import styles from './Signup.module.scss'

const Signup = () => {
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
      await dispatch(signupUser(values)).unwrap()
      message.success('Registration successful!')
    } catch (err) {
      if (typeof err === 'string') {
        message.error(err)
      } else if (typeof err === 'object') {
        // Don't show message here as we'll show field-level errors
      } else {
        message.error('Registration failed')
      }
    }
  }

  return (
    <div className={styles.signupContainer}>
      <Card title="Sign Up" className={styles.signupCard}>
        <Form
          name="signup"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            validateStatus={error?.name ? 'error' : ''}
            help={error?.name?.[0]}
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

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
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="password_confirmation"
            validateStatus={error?.password_confirmation ? 'error' : ''}
            help={error?.password_confirmation?.[0]}
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject('Passwords do not match!')
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>

          {error && typeof error === 'string' && (
            <div className={styles.errorMessage}>{error}</div>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} block>
              Sign Up
            </Button>
          </Form.Item>

          <div className={styles.loginLink}>
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Signup 