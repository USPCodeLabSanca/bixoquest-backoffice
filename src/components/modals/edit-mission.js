import React from 'react';

import {MapContainer, Marker, TileLayer} from 'react-leaflet';
import {toast} from 'react-toastify';
import Modal from '@material-ui/core/Modal';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import {KeyboardDateTimePicker} from '@material-ui/pickers';

import API from '../../api';
import {defaultCoordinates} from '../../constants/coordinates';
import Button from '../button';

const style = {
  root: 'w-full h-full px-4 py-16 flex justify-center items-center',
  card: 'bg-white w-full max-w-lg rounded-lg p-4 max-h-full overflow-y-auto',
  title: 'text-2xl text-center font-bold',
  form: 'flex flex-col w-full item-center justify-center',
  input: {margin: '0.5rem 0'},
  button: {marginTop: '2rem'},
};

/**
 * CreateMissionModal
 *
 * @param {object} param0
 *
 * @return {object}
 */
export default function CreateMissionModal({
  onRequestClose = () => {},
  onSubmit = () => {},
  mission: missionEdited,
}) {
  const markerRef = React.useRef();
  const titleRef = React.useRef();
  const descriptionRef = React.useRef();
  const locationReferenceRef = React.useRef();
  const packetsRef = React.useRef();
  const keyRef = React.useRef();

  const [isEditingMission, setIsEditingMission] = React.useState(false);
  const [missionType, setMissionType] = React.useState(missionEdited.type);
  const [startDate, setStartDate] = React.useState(missionEdited.availableAt);
  const [endDate, setEndDate] = React.useState(missionEdited.expirateAt);

  /**
   * submit
   *
   * @param {object} event
   *
   * @return {void}
   */
  async function submit(event) {
    if (event) event.preventDefault();

    const title = titleRef.current.value;
    const description = descriptionRef.current.value;
    const locationReference = locationReferenceRef.current.value;
    const packs = packetsRef.current.value;

    if (!title) return toast.error('Você deve fornecer um titulo');
    if (!description) return toast.error('Você deve fornecer uma descrição');
    if (!locationReference) return toast.error('Você deve fornecer um local de referência');
    if (!packs) return toast.error('Você deve fornecer uma quantidade de pacotes');
    if (packs <= 0) return toast.error('Você deve fornecer uma quantidade positiva de pacotes');
    if (!startDate) return toast.error('Você deve fornecer uma data de início');
    if (!endDate) return toast.error('Você deve fornecer uma data de fim');
    if (!missionType) return toast.error('Você deve fornecer uma tipo de missão');

    const mission = {
      ...missionEdited,
      title,
      description,
      locationReference: locationReference,
      numberOfPacks: packs,
      availableAt: startDate.valueOf(),
      expirateAt: endDate.valueOf(),
      type: missionType,
    };

    if (missionType === 'key') {
      const key = keyRef.current.value;
      if (!key) return toast.error('Você deve fornecer uma chave');
      if (key.length < 6) return toast.error('Você deve fornecer uma chave de no mínimo 6 dígitos');
      mission.key = key;
    } else if (missionType === 'location') {
      const {lat, lng} = markerRef.current.getLatLng();
      mission.lat = lat;
      mission.lng = lng;
    }

    setIsEditingMission(true);
    try {
      const {data: newMission} = await API.editMissions(mission);
      toast.success('Missão editada com sucesso!');
      onSubmit(newMission);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEditingMission(false);
    }
  }

  /**
   * renderMap
   *
   * @return {object}
   */
  function renderMap() {
    if (missionType !== 'location') return null;
    return (
      <MapContainer
        center={[missionEdited.lat || defaultCoordinates.lat, missionEdited.lng || defaultCoordinates.lng]}
        zoom={17}
        zoomSnap={0.01}
        maxZoom={18} // Map cannot have more than 18 zoom without breaking
        style={{height: '300px', width: '100%', margin: '0.5rem 0'}}
      >
        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={[missionEdited.lat || defaultCoordinates.lat, missionEdited.lng || defaultCoordinates.lng]} draggable ref={markerRef} />
      </MapContainer>
    );
  }

  /**
   * renderKey
   *
   * @return {object}
   */
  function renderKey() {
    if (missionType !== 'key') return null;
    return <TextField
      fullWidth
      defaultValue={missionEdited.key}
      label='Chave'
      inputRef={keyRef}
      style={style.input}
    />;
  }

  return (
    <Modal open onClose={onRequestClose}>
      <div className={style.root} onClick={onRequestClose}>
        <div className={style.card} onClick={(event) => event.stopPropagation()}>
          <h1 className={style.title}>Edição de missão</h1>
          <form className={style.form} onSubmit={submit}>
            <TextField
              defaultValue={missionEdited.title}
              fullWidth
              label='Título'
              inputRef={titleRef}
              style={style.input}
            />
            <TextField
              fullWidth
              defaultValue={missionEdited.description}
              label='Descrição'
              inputRef={descriptionRef}
              style={style.input}
            />
            <TextField
              fullWidth
              defaultValue={missionEdited.locationReference}
              label='Local de referência'
              inputRef={locationReferenceRef}
              style={style.input}
            />
            <TextField
              fullWidth
              defaultValue={missionEdited.numberOfPacks}
              label='Número de pacotes de recompensa'
              inputRef={packetsRef}
              style={style.input}
              type='number'
            />
            <KeyboardDateTimePicker
              fullWidth
              label='Data de inicio'
              value={startDate}
              style={style.input}
              onChange={(date) => setStartDate(date)}
              variant='inline'
              format='DD/MM/YYYY HH[h] mm[m]'
              minDate={new Date('04/01/2021')}
              maxDate={new Date('06/01/2021')}
            />
            <KeyboardDateTimePicker
              fullWidth
              label='Data de término'
              value={endDate}
              style={style.input}
              onChange={(date) => setEndDate(date)}
              variant='inline'
              format='DD/MM/YYYY HH[h] mm[m]'
              minDate={new Date('04/01/2021')}
              maxDate={new Date('06/01/2021')}
            />
            <Select
              value={missionType}
              onChange={(event) => setMissionType(event.target.value)}
              style={style.input}
            >
              <MenuItem value='location'>Localização</MenuItem>
              <MenuItem value='key'>Chave</MenuItem>
            </Select>
            {renderMap()}
            {renderKey()}
            <Button
              fullWidth
              variant='contained'
              type='submit'
              style={style.button}
              isLoading={isEditingMission}
            >
              editar
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  );
}
