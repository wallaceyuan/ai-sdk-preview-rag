import {useRequest} from 'ahooks';
import {Row, Col, Card} from 'antd'


const getAppList = async () => {
  const response = await fetch('/api/core/app/list', {  method: 'POST' ,body: JSON.stringify({ 
    parentId: null,
    searchKey: ""
  })})
  const data = await response.json()
  console.log('data', data)
  return data?.body as any[]
}

const delApp = async (appId: string) => {
  const response = await fetch(`/api/core/app/del?appId=${appId}`, {  method: 'DELETE' })
  const data = await response.json()
  console.log('data', data)
  return data?.body as any[]
}


const AppList = () => {

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


  console.log('myApps', myApps)
  return(
    <>
      <Row>
        {myApps?.map(app => (
          <Col span={6}>
            <Card onClick={() => run(app._id)}>
              {app.name}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}
export default AppList;