import {useRequest} from 'ahooks';
import {Row, Col, Card, Button} from 'antd'
import { useRouter } from 'next/router';
import { useCallback } from 'react';


const getAppList = async () => {
  const response = await fetch('/api/core/app/list', {  method: 'POST' ,body: JSON.stringify({ 
    parentId: null,
    searchKey: ""
  })})
  const data = await response.json()
  console.log('data', data)
  return data?.data as any[]
}

const delApp = async (appId: string) => {
  const response = await fetch(`/api/core/app/del?appId=${appId}`, {  method: 'DELETE' })
  const data = await response.json()
  console.log('data', data)
  return data?.data as any[]
}


const AppList = () => {

  const router = useRouter();

  const { data: myApps = [], runAsync: loadMyApps } = useRequest(
    () => getAppList(),
  );

  const { run } = useRequest(
    (params) => delApp(params),
    {
      manual: true,
      onSuccess: () => {
        loadMyApps();
      }
    }
  );

  const onChangeApp = useCallback(
    (appId: string) => {
      router.push('/app/detail?appId=' + appId);
    },
    [router]
  );

  return(
    <>
      <Row>
        {myApps?.map(app => (
          <Col span={6}>
            <Card onClick={() => onChangeApp(app._id)} style={{ position: 'relative' }} extra={<Button type="text" danger onClick={() => run(app._id)}>删除</Button>}>
              {app.name}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}
export default AppList;