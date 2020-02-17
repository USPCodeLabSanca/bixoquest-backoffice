import React from 'react'

import MUIDataTable from 'mui-datatables'
import dayJS from 'dayjs'
import QRCode from 'qrcode.react'

import IconButton from '@material-ui/core/IconButton'
import AddIcon from '@material-ui/icons/Add'

import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'

import withLateralMenu from '../services/lateral-menu'
import API from '../api'

import Spinner from '../components/Spinner'
import MissionMap from '../components/mission-map'
import CreateMissionModal from '../components/modals/create-mission'
import EditMissionModal from '../components/modals/edit-mission'
import DeleteMissionModal from '../components/modals/delete-mission'

const style = {
  root: 'w-full',
  title: 'text-2xl text-center mb-16',
  tableContainer: 'mx-4',
  description: 'text-center',
  editIcon: { cursor: 'pointer', margin: '0.5rem' }
}

const columns = [
  { name: 'Titulo', options: { filter: false } },
  { name: 'Local de referência', options: { filter: false } },
  { name: 'Número de pacotes', options: { filter: false } },
  { name: 'Disponivel em', options: { filter: false } },
  { name: 'Expira em', options: { filter: false } },
  { name: 'Tipo', options: { sort: false } }
]

function missionToData (mision) {
  return [
    mision.title,
    mision.location_reference,
    mision.number_of_packs,
    dayJS(mision.available_at).format('DD/MM/YYYY HH[h] mm[m]'),
    dayJS(mision.expirate_at).format('DD/MM/YYYY HH[h] mm[m]'),
    mision.type
  ]
}

function MissionsPage () {
  const [isFetchingMission, setIsFetchingMission] = React.useState(true)
  const [showingCreateMissionModal, setShowingCreateMissionModal] = React.useState(false)
  const [showingEditMissionModal, setShowingEditMissionModal] = React.useState(null)
  const [showingDeleteMissionModal, setShowingDeleteMissionModal] = React.useState(null)
  const [missions, setMissions] = React.useState()

  async function fetchMissions () {
    setIsFetchingMission(true)
    try {
      const { data: { data: missions } } = await API.getMissions()
      setMissions(missions)
    } catch (e) { console.error(e) } finally {
      setIsFetchingMission(false)
    }
  }

  React.useEffect(() => {
    fetchMissions()
  }, [])

  function renderQRCode (key) {
    console.log(key)
    return <QRCode
      value={key}
      style={{ height: 250, width: 250 }}
    />
  }

  function renderExpandableRow (rowData, rowMeta) {
    const mission = missions[rowMeta.dataIndex]
    const Row = ({ name, value, style }) => (
      <tr className='border'>
        <th>{name}</th>
        <td><div style={style}>{value}</div></td>
      </tr>
    )
    return (
      <>
        <Row name='_id' value={mission._id} />
        <Row name='descrição' value={mission.description} />
        <Row name='latitude' value={mission.lat} />
        <Row name='longitude' value={mission.lng} />
        { mission.type === 'location' && <Row name='mapa' value={<MissionMap lat={mission.lat} lng={mission.lng} />} /> }
        { mission.type === 'qrcode' && <>
          <Row name='QRCode' value={renderQRCode(mission.key)} />
          <Row name='QRCode key' value={mission.key} style={{ width: 250, wordBreak: 'break-all' }}/>
        </> }
        { mission.type === 'key' && <Row name='palavra chave' value={mission.key} /> }
      </>
    )
  }

  function renderToolbar () {
    function openCreateModal () {
      setShowingCreateMissionModal(true)
    }
    return <IconButton onClick={openCreateModal}><AddIcon /></IconButton>
  }

  function renderToolbarSelect (selectedRows) {
    const missionIndex = Object.keys(selectedRows.lookup)[0]
    const mission = missions[missionIndex]
    function openDeleteModal () {
      setShowingDeleteMissionModal(mission)
    }
    function openEditModal () {
      setShowingEditMissionModal(mission)
    }
    return <div>
      <IconButton onClick={openDeleteModal}>
        <DeleteIcon style={style.editIcon} />
      </IconButton>
      <IconButton onClick={openEditModal}>
        <EditIcon style={style.editIcon} />
      </IconButton>
    </div>
  }

  function renderTable () {
    if (isFetchingMission) return <Spinner type='loading' />
    if (!missions) return <p>Houve um erro carregando as missões</p>
    return (
      <MUIDataTable
        title='Missões'
        options={{
          filterType: 'multiselect',
          pagination: false,
          print: false,
          downloadOptions: { filename: 'BixoQuest-missions.csv' },
          selectableRows: 'single',
          expandableRowsOnClick: true,
          expandableRows: true,
          renderExpandableRow: renderExpandableRow,
          customToolbar: renderToolbar,
          customToolbarSelect: renderToolbarSelect
        }}
        columns={columns}
        data={missions.map(missionToData)}
      />
    )
  }

  function renderOverlay () {
    function missionCreated (mission) {
      setMissions([...missions, mission])
      setShowingCreateMissionModal(false)
    }
    function missionDeleted (mission) {
      const newMissions = [...missions]
      newMissions.splice(newMissions.findIndex(m => m._id === mission._id), 1)
      setMissions(newMissions)
      setShowingDeleteMissionModal(false)
    }
    function missionEdited (mission) {
      const newMissions = [...missions]
      const modifiedMissionIndex = newMissions.findIndex(m => m._id === mission._id)
      newMissions[modifiedMissionIndex] = mission
      setMissions(newMissions)
      setShowingEditMissionModal(false)
    }
    const closeCreateMission = () => setShowingCreateMissionModal(false)
    const closeEditMission = () => setShowingEditMissionModal(false)
    const closeDeleteMission = () => setShowingDeleteMissionModal(false)
    if (showingCreateMissionModal){
      return <CreateMissionModal
        onRequestClose={closeCreateMission}
        onSubmit={missionCreated}
      />
    } else if (showingEditMissionModal) {
      return <EditMissionModal
        mission={showingEditMissionModal}
        onRequestClose={closeEditMission}
        onSubmit={missionEdited}
      />
    } else if (showingDeleteMissionModal) {
      return <DeleteMissionModal
        mission={showingDeleteMissionModal}
        onRequestClose={closeDeleteMission}
        onSubmit={missionDeleted}
      />
    }
  }

  return (
    <main className={style.root}>
      {renderOverlay()}
      <h1 className={style.title}>
        Missões
      </h1>
      <div className={style.tableContainer}>
        {renderTable()}
      </div>
    </main>
  )
}

export default withLateralMenu(MissionsPage)
