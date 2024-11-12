import { defaultAppTemplates } from '@/web/core/app/templates'
import { Button } from 'antd';

const App = () => {

  const createApp = () => {
    const template = defaultAppTemplates[0]

    fetch('/api/app/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: template.avatar,
        name: "time bot",
        modules: template.modules,
        edges: template.edges,
        type: template.type,
        teamId: '6711e80e6a345036775bf96e',
        tmbId: '6711e80e6a345036775bf970'
      })
    }).then(response => {
      // form.resetFields()
      // response.json()
      // refresh()
    })
  }

  return(
    <>
      <Button onClick={createApp}>创建应用</Button>
    </>
  )
}

export default App;