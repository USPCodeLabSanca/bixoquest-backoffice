import React from 'react'

import Modal from '@material-ui/core/Modal'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Button from '../button'
import { KeyboardDatePicker } from '@material-ui/pickers'

import API from '../../api'

import { Map, Marker, TileLayer } from 'react-leaflet'
import { popup } from 'leaflet'
import { toast } from 'react-toastify'

const style = {
  root: 'w-full h-full px-4 py-16 flex justify-center items-center',
  card: 'bg-white w-full max-w-lg rounded-lg p-4 max-h-full overflow-y-auto',
  title: 'text-2xl text-center font-bold',
  form: 'flex flex-col w-full item-center justify-center',
  input: { margin: '0.5rem 0' },
  button: { marginTop: '2rem' }
}

export default function CreateMissionModal ({ onRequestClose = () => {}, onSubmit = () => {} }) {
  const markerRef = React.useRef()
  const titleRef = React.useRef()
  const descriptionRef = React.useRef()
  const locationReferenceRef = React.useRef()
  const packetsRef = React.useRef()
  const passwordRef = React.useRef()

  const [isCreatingMission, setIsCreatingMission] = React.useState(false)
  const [missionType, setMissionType] = React.useState('')
  const [startDate, setStartDate] = React.useState(null)
  const [endDate, setEndDate] = React.useState(null)

 async function submit (event) {
    if (event) event.preventDefault()

    const title = titleRef.current.value
    const description = descriptionRef.current.value
    const locationReference = locationReferenceRef.current.value
    const packs = packetsRef.current.value

    if (!title) return toast.error('Você deve fornecer um titulo')
    if (!description) return toast.error('Você deve fornecer uma descrição')
    if (!locationReference) return toast.error('Você deve fornecer um local de referência')
    if (!packs) return toast.error('Você deve fornecer uma quantidade de pacotes')
    if (packs <= 0) return toast.error('Você deve fornecer uma quantidade positiva de pacotes')
    if (!startDate) return toast.error('Você deve fornecer uma data de início')
    if (!endDate) return toast.error('Você deve fornecer uma data de fim')
    if (!missionType) return toast.error('Você deve fornecer uma tipo de missão')

    const mission = {
      title,
      description,
      location_reference: locationReference,
      number_of_packs: packs,
      available_at: startDate.valueOf(),
      expirate_at: endDate.valueOf(),
      type: missionType
    }

    if (missionType === 'key') {
      const password = passwordRef.current.value.trim().toLowerCase()
      if (!password) return toast.error('Você deve fornecer uma senha')
      if (password.length < 6) return toast.error('Você deve fornecer uma senha de no mínimo 6 dígitos')
      mission.key = password
    } else if (missionType === 'location') {
      const { lat, lng } = markerRef.current.leafletElement.getLatLng()
      mission.lat = lat
      mission.lng = lng
    }

    setIsCreatingMission(true)
    try {
      const { data: { data: newMission } } = await API.createMissions(mission)
      toast.success('Missão criada com sucesso!')
      onSubmit(newMission)
    } catch (e) { console.error(e) } finally {
      setIsCreatingMission(false)
    }
  }

  function openPopup (mapElem) {
    if (!mapElem) return
    mapElem.leafletElement.openPopup(popup().setContent('Drag me').setLatLng([-22.0065, -47.896722]))
  }

  function renderMap () {
    if (missionType !== 'location') return null
    return (
      <Map
        center={[-22.006881, -47.896722]}
        zoom={17}
        zoomSnap={0.01}
        ref={openPopup}
        maxZoom={19} // Map cannot have more than 19 zoom without breaking
        style={{ height: '300px', width: '100%', margin: '0.5rem 0' }}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={[-22.006881, -47.896722]} draggable ref={markerRef} />
      </Map>
    )
  }

  function renderPassword () {
    if (missionType !== 'key') return null
    return <TextField
      fullWidth
      label='Palavra chave'
      inputRef={passwordRef}
      style={style.input}
    />
  }

  return (
    <Modal open onClose={onRequestClose}>
      <div className={style.root} onClick={onRequestClose}>
        <div className={style.card} onClick={event => event.stopPropagation()}>
          <h1 className={style.title}>Criação de missão</h1>
          <form className={style.form} onSubmit={submit}>
            <TextField
              fullWidth
              label='Título'
              inputRef={titleRef}
              style={style.input}
            />
            <TextField
              fullWidth
              label='Descrição'
              inputRef={descriptionRef}
              style={style.input}
            />
            <TextField
              fullWidth
              label='Local de referência'
              inputRef={locationReferenceRef}
              style={style.input}
            />
            <TextField
              fullWidth
              label='Número de pacotes de recompensa'
              inputRef={packetsRef}
              style={style.input}
              type='number'
            />
            <KeyboardDatePicker
              fullWidth
              label='Data de inicio'
              value={startDate}
              style={style.input}
              onChange={date => setStartDate(date)}
              variant='inline'
              format='DD/MM/YYYY'
              minDate={new Date('01/17/2020')}
              maxDate={new Date('06/24/2020')}
            />
            <KeyboardDatePicker
              fullWidth
              label='Data de término'
              value={endDate}
              style={style.input}
              onChange={date => setEndDate(date)}
              variant='inline'
              format='DD/MM/YYYY'
              minDate={new Date('01/17/2020')}
              maxDate={new Date('06/24/2020')}
            />
            <Select
              value={missionType}
              placeholder='location'
              onChange={event => setMissionType(event.target.value)}
              style={style.input}
            >
              <MenuItem value='location'>Localização</MenuItem>
              <MenuItem value='qrcode'>QrCode</MenuItem>
              <MenuItem value='key'>Palavra chave</MenuItem>
            </Select>
            {renderMap()}
            {renderPassword()}
            <Button
              fullWidth
              variant='contained'
              onClick={submit}
              style={style.button}
              isLoading={isCreatingMission}
            >
              criar
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  )
}