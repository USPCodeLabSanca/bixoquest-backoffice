import React from 'react'

import dayJS from 'dayjs'

import Modal from '@material-ui/core/Modal'
import Button from '../button'
import API from '../../api'
import { toast } from 'react-toastify'

const style = {
  root: 'w-full h-full flex justify-center items-center px-4 py-16',
  card: 'bg-white rounded-lg shadow-xl w-full max-h-full max-w-lg p-4',
  title: 'text-2xl text-center text-white',
  titleStyle: { backgroundColor: 'red' },
  rowRoot: 'py-2',
}

const Row = ({ name, value }) => <div className={style.rowRoot}>
  <span>{name}: </span><span>{value}</span>
</div>

export default function DeleteMissionModal ({ onRequestClose, mission, onSubmit = () => {} }) {
  const [isDeleting, setIsDeleting] = React.useState(false)

  async function submit () {
    setIsDeleting(true)
    try {
      await API.deleteMission(mission._id)
      toast.success('Missão deletada com sucesso')
      onSubmit(mission)
    } catch (e) { console.error(e) } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Modal open onClose={onRequestClose}>
      <div className={style.root} onClick={onRequestClose}>
        <div className={style.card} onClick={event => event.stopPropagation()}>
          <h1 className={style.title} style={style.titleStyle}>
            Você está deletando essa missão
          </h1>
          <Row name='id' value={mission._id} />
          <Row name='titulo' value={mission.title} />
          <Row name='descrição' value={mission.description} />
          <Row name='Local de referencia' value={mission.location_reference} />
          <Row name='Número de packs' value={mission.number_of_packs} />
          <Row name='Data de inicio' value={dayJS(mission.available_at).format('DD/MM/YYYY HH[h] mm[m]')} />
          <Row name='Data de fim' value={dayJS(mission.expirate_at).format('DD/MM/YYYY HH[h] mm[m]')} />
          <Button isLoading={isDeleting} fullWidth onClick={submit} variant='contained'>Deletar</Button>
        </div>
      </div>
    </Modal>
  )
}
