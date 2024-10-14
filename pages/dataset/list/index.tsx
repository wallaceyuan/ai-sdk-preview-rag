import { useEffect, useState } from 'react'
import { useRequest } from 'ahooks'
import { Row, Col, Select, Divider, Empty, Card, Form, Input, Button } from 'antd'

import Chat from './component/Chat'

const getknowledgeList = async () => {
  const response = await fetch('/api/knowledge/knowledgeList')
  const data = await response.json()
  return data?.knowledges as { files: any[]; id: number; name: string; embedding: string; model: string }[]
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

  const [ kId, setKId ] = useState<number>();

  const createKnowledge = () => {
    form.validateFields().then(values => {
      fetch('/api/knowledge/knowledgeList', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      }).then(response => {
        form.resetFields()
        response.json()
        refresh()
      })
    })
  }

  return (
    <Row gutter={30} style={{ padding: 20 }}>
      <Col span={12}>
        <div>
          <h3 style={{ marginBottom: 20 }}>知识库</h3>
          { data?.length? 
            <Row gutter={20}>
              {
                data.map(k => (
                  <Col key={k?.id} span={8}>
                  <Card 
                    title={k?.name}
                    hoverable 
                    onClick={() => setKId(k?.id)}
                    style={{
                      marginBottom: 10,
                      cursor: 'pointer',
                      borderColor: kId === k?.id ? '#1890ff' : '#d9d9d9', // 根据选中状态改变边框颜色
                      boxShadow: kId === k?.id ? '0 2px 8px rgba(0, 0, 0, 0.1)' : 'none' // 选中时添加阴影效果
                    }}
                  >
                    <p>知识库Id: {k?.id}</p>
                    <p>索引模型: {k?.embedding}</p>
                    <p>文本理解模型: {k?.model}</p>
                    <p>文本: <ul>{k?.files.map(file => (<li key={file.id}>{file.filename}</li>))}</ul></p>
                  </Card>
                  </Col>
                ))
              }
            </Row>
        : <Empty /> }
        </div>
        <Divider />
        <div>
          <h3 style={{ marginBottom: 20 }}>新增知识库</h3>
          <Form style={{ width: 300 }}  form={form} onFinish={createKnowledge} initialValues={{ embedding: 'text-embedding-ada-002', model: 'gpt-4o',  }}>
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
        <Chat kId={kId} />
      </Col>
    </Row>
  );
}
