import React, { useEffect } from 'react'
import { Form, Input, Button, Card, message, Upload } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { UploadOutlined } from '@ant-design/icons'
import { updateAuthor } from '../../store/slices/authorsSlice'
import styles from './AuthorEditForm.module.scss'

const { TextArea } = Input

const AuthorEditForm = () => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { authorId } = useParams()
  const { currentAuthor, isLoading } = useSelector((state) => state.authors)

  useEffect(() => {
    if (currentAuthor) {
      form.setFieldsValue(currentAuthor)
    }
  }, [currentAuthor, form])

  const onFinish = async (values) => {
    try {
      await dispatch(updateAuthor({ authorId, authorData: values })).unwrap()
      message.success('Profile updated successfully')
      navigate(`/authors/${authorId}`)
    } catch (error) {
      message.error('Failed to update profile')
    }
  }

  return (
    <div className={styles.formContainer}>
      <Card title="Edit Profile">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={currentAuthor}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Bio" name="bio">
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} block>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default AuthorEditForm 