import React from 'react';

import Modal from '@material-ui/core/Modal';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '../button';
import {KeyboardDatePicker} from '@material-ui/pickers';

import API from '../../api';

import {MapContainer, Marker, TileLayer} from 'react-leaflet';
import {popup} from 'leaflet';
import {toast} from 'react-toastify';

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
  const passwordRef = React.useRef();

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

    if (missionType === 'password') {
      const password = passwordRef.current.value;
      if (!password) return toast.error('Você deve fornecer uma senha');
      if (password.length < 6) return toast.error('Você deve fornecer uma senha de no mínimo 6 dígitos');
      mission.key = password;
    } else if (missionType === 'location') {
      const {lat, lng} = markerRef.current.leafletElement.getLatLng();
      mission.lat = lat;
      mission.lng = lng;
    }

    setIsEditingMission(true);
    try {
      const {data: {data: newMission}} = await API.editMissions(mission);
      toast.success('Missão editada com sucesso!');
      onSubmit(newMission);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEditingMission(false);
    }
  }

  /**
   * openPopup
   *
   * @param {object} mapElem
   *
   * @return {void}
   */
  function openPopup(mapElem) {
    if (!mapElem) return;
    mapElem.leafletElement.openPopup(popup().setContent('Drag me').setLatLng([missionEdited.lat + 0.0004, missionEdited.lng]));
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
        center={[missionEdited.lat, missionEdited.lng]}
        zoom={17}
        zoomSnap={0.01}
        ref={openPopup}
        maxZoom={19} // Map cannot have more than 19 zoom without breaking
        style={{height: '300px', width: '100%', margin: '0.5rem 0'}}
      >
        <TileLayer
          attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={[missionEdited.lat, missionEdited.lng]} draggable ref={markerRef} />
      </MapContainer>
    );
  }

  /**
   * renderPassword
   *
   * @return {object}
   */
  function renderPassword() {
    if (missionType !== 'password') return null;
    return <TextField
      fullWidth
      defaultValue={missionEdited.key}
      label='Palavra chave'
      inputRef={passwordRef}
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
            <KeyboardDatePicker
              fullWidth
              label='Data de inicio'
              value={startDate}
              style={style.input}
              onChange={(date) => setStartDate(date)}
              variant='inline'
              format='DD/MM/YYYY HH[h] mm[m]'
              minDate={new Date('01/17/2020')}
              maxDate={new Date('06/24/2020')}
            />
            <KeyboardDatePicker
              fullWidth
              label='Data de término'
              value={endDate}
              style={style.input}
              onChange={(date) => setEndDate(date)}
              variant='inline'
              format='DD/MM/YYYY HH[h] mm[m]'
              minDate={new Date('01/17/2020')}
              maxDate={new Date('06/24/2020')}
            />
            <Select
              value={missionType}
              onChange={(event) => setMissionType(event.target.value)}
              style={style.input}
            >
              <MenuItem value='location'>Localização</MenuItem>
              <MenuItem value='qrcode'>QrCode</MenuItem>
              <MenuItem value='password'>Palavra chave</MenuItem>
            </Select>
            {renderMap()}
            {renderPassword()}
            <Button
              fullWidth
              variant='contained'
              onClick={submit}
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
