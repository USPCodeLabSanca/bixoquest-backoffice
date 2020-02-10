import React from 'react'

import MUIDataTable from 'mui-datatables'

import withLateralMenu from '../services/lateral-menu'
import API from '../api'
import Spinner from '../components/Spinner'

const style = {
  root: 'w-full',
  title: 'text-2xl text-center mb-16',
  tableContainer: 'mx-4',
  description: 'text-center'
}

const columns = [
  { name: 'Nusp', options: { filter: false } },
  { name: 'Nome', options: { filter: false } },
  { name: 'Curso', options: { sort: false } },
  { name: 'Quantidade Mssões completadas', options: { filter: false } },
  { name: 'Packs disponíveis', options: { filter: false } },
  { name: 'Packs abertos', options: { filter: false } },
  { name: 'Quantidade Figurinhas', options: { filter: false } },
]

function userToData (user) {
  return [
    user.nusp,
    user.name,
    user.course,
    user.completed_missions.length,
    user.available_packs,
    user.opened_packs,
    user.stickers.length
  ]
}

function UsersPage () {
  const [isFetchingUsers, setIsFetchingUsers] = React.useState(true)
  const [users, setUsers] = React.useState()

  async function fetchUsers () {
    setIsFetchingUsers(true)
    try {
      const { data: { data: users } } = await API.getUser()
      setUsers(users)
    } catch (e) { console.error(e) } finally {
      setIsFetchingUsers(false)
    }
  }

  React.useEffect(() => {
    fetchUsers()
  }, [])

  function renderExpandableRow (rowData, rowMeta) {
    const user = users[rowMeta.dataIndex]
    const Row = ({ name, value }) => (
      <tr className='border'>
        <th>{name}</th>
        <td>{value}</td>
      </tr>
    )
    return (
      <>
        <Row name='_id' value={user._id} />
        <Row name='Figurinhas' value={user.stickers.join(', ')} />
        <Row name='Missões completadas' value={user.completed_missions.join(', ')} />
      </>
    )
  }

  function renderTable () {
    if (isFetchingUsers) return <Spinner type='loading' />
    if (!users) return <p>Houve um erro buscando os usuários</p>
    return (
      <MUIDataTable
        title='Usuários'
        options={{
          filterType: 'multiselect',
          pagination: false,
          print: false,
          expandableRowsOnClick: true,
          expandableRows: true,
          renderExpandableRow: renderExpandableRow,
          downloadOptions: { filename: 'BixoQuest-users.csv' },
          selectableRows: 'none'
        }}
        columns={columns}
        data={users.map(userToData)}
      />
    )
  }

  return (
    <main className={style.root}>
      <h1 className={style.title}>
        Usuários
      </h1>
      <div className={style.tableContainer}>
        {renderTable()}
      </div>
    </main>
  )
}

export default withLateralMenu(UsersPage)
