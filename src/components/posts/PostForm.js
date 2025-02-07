import React from 'react'
import { Form, Input, Button, message } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { createPost, updatePost } from '../../store/slices/postsSlice'
import styles from './PostForm.module.scss'

const { TextArea } = Input

const PostForm = ({ initialValues, onSuccess }) => {
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const { isLoading, error } = useSelector((state) => state.posts)

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues)
    }
    return () => form.resetFields()
  }, [form, initialValues])

  const onFinish = async (values) => {
    try {
      if (initialValues) {
        await dispatch(updatePost({ 
          postId: initialValues.id, 
          postData: values 
        })).unwrap()
        message.success('Post updated successfully')
      } else {
        await dispatch(createPost(values)).unwrap()
        message.success('Post created successfully')
      }
      onSuccess?.()
    } catch (err) {
      if (typeof err === 'object') {
        // Field level errors are handled by form validation
        return
      }
      message.error(err || `Failed to ${initialValues ? 'update' : 'create'} post`)
    }
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className={styles.form}
    >
      <Form.Item
        label="Title"
        name="title"
        validateStatus={error?.title ? 'error' : ''}
        help={error?.title?.[0]}
        rules={[
          { required: true, message: 'Please input post title!' },
          { max: 255, message: 'Title cannot be longer than 255 characters!' }
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Content"
        name="content"
        validateStatus={error?.content ? 'error' : ''}
        help={error?.content?.[0]}
        rules={[{ required: true, message: 'Please input post content!' }]}
      >
        <TextArea rows={6} />
      </Form.Item>

      {error && typeof error === 'string' && (
        <div className={styles.errorMessage}>{error}</div>
      )}

      <Form.Item className={styles.submitButton}>
        <Button type="primary" htmlType="submit" loading={isLoading} block>
          {initialValues ? 'Update Post' : 'Create Post'}
        </Button>
      </Form.Item>
    </Form>
  )
}

export default PostForm 