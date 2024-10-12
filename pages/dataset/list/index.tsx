import { useEffect, useState } from 'react'
import { useRequest } from 'ahooks'
import { Row, Col, Select, Divider, Empty, Card, Form, Input, Button } from 'antd'

const getknowledgeList = async () => {
  const response = await fetch('/api/knowledge/knowledgeList')
  const data = await response.json()
  return data?.knowledges as { id: number; name: string; embedding: string; model: string }[]
}

const getBookList = async () => {
  const response = await fetch('/api/knowledge/bookList')
  const data = await response.json()
  return data?.files as { id: number; filename: string }[]
}


export default function Home() {

  const [form] = Form.useForm()

  const { data, refresh } = useRequest(getknowledgeList)
  const { data: books } = useRequest(getBookList)

  const createKnowledge = () => {
    form.validateFields().then(values => {
      fetch('/api/knowledge/knowledgeList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      }).then(response => {
        response.json()
        refresh()
      })
    })
  }

  return (
    <Row gutter={8}>
      <Col span={12}>
        <div>
          <h4 style={{ marginBottom: 20 }}>知识库</h4>
          { data?.length? data?.map(k => (
            <Card key={k.id} title={k.name}>
              <p>知识库Id: {k.id}</p>
              <p>索引模型: {k.embedding}</p>
              <p>文本理解模型: {k.model}</p>
            </Card>
          )): <Empty /> }
        </div>
        <Divider />
        <div>
          <h4 style={{ marginBottom: 20 }}>新增知识库</h4>
          <Form form={form} onFinish={createKnowledge} initialValues={{ embedding: 'text-embedding-ada-002', model: 'gpt-4o',  }}>
            <Form.Item>
              <Form.Item name='name' label='知识库名称'>
                <Input placeholder='请输入知识库名称' />
              </Form.Item>
              <Form.Item name='embedding' label='索引模型'>
                <Select>
                  <Select.Option value='text-embedding-ada-002'>text-embedding-ada-002</Select.Option>
                </Select>
              </Form.Item>  
              <Form.Item name='model' label='文本理解模型'>
                <Select>
                  <Select.Option value='gpt-4o'>gpt-4o</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name='files' label='关联文件'>
                <Select style={{ width: 200, marginLeft: 20 }} mode='multiple'>
                  {books?.map((file) => (
                    <Select.Option key={file.id}>{file.filename}</Select.Option>
                  ))}
                </Select>
              </Form.Item>  
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType='submit'>提交</Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
      <Col span={12}>
        <h4 style={{ marginBottom: 20 }}>问答</h4>   
      </Col>
    </Row>
  );
}
