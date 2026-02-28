import React from 'react';
import { FaBed, FaDollarSign, FaUser } from "react-icons/fa";
import { RoomRequestDTO, roomTypes } from '../../types/Room';
import { GradientButton } from '../Button';
import { InputField, SelectField } from '../Form';

interface Props {
  rooms: RoomRequestDTO[];
  setRooms: React.Dispatch<React.SetStateAction<RoomRequestDTO[]>>;
}

export const RoomTypeList: React.FC<Props> = ({ rooms, setRooms }) => {
  const roomKeyMapRef = React.useRef(new WeakMap<RoomRequestDTO, string>());
  const roomKeyCounterRef = React.useRef(0);

  const getRoomKey = (room: RoomRequestDTO) => {
    const existingKey = roomKeyMapRef.current.get(room);
    if (existingKey) return existingKey;

    const newKey = `room-${roomKeyCounterRef.current}`;
    roomKeyCounterRef.current += 1;
    roomKeyMapRef.current.set(room, newKey);
    return newKey;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-gray-800">Room Types</h3>
        <GradientButton
          type="button"
          onClick={() => setRooms([...rooms, { roomType: '', pricePerNight: 0, maxOccupancy: 1, quantity: 0 }])}
          className="py-2 px-4 text-white font-semibold rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300"
        >
          + Add Room Type
        </GradientButton>
      </div>
      <div className="space-y-4">
        {rooms.map((room, idx) => (
          <div key={getRoomKey(room)} className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 shadow-md rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:space-x-6 gap-4 hover:shadow-2xl transition-all duration-300 relative">
            <div className="flex-1 min-w-[150px]">
              <SelectField
                label={<span className="flex items-center gap-2"><FaBed className="text-indigo-500" /> Room Type</span>}
                name={`roomType_${idx}`}
                value={room.roomType}
                onChange={e => { const updated = [...rooms]; updated[idx].roomType = e.target.value; setRooms(updated); }}
                options={roomTypes.map(t => ({ value: t, label: t }))}
                disabledPlaceholder="Select Room Type"
              />
            </div>
            <div className="flex-1 min-w-[120px] max-w-[180px]">
              <InputField
                name={`pricePerNight_${idx}`}
                label={<span className="flex items-center gap-2"><FaDollarSign className="text-green-500" /> Price/Night</span>}
                type="number"
                value={room.pricePerNight?.toString() || ''}
                onChange={e => { const updated = [...rooms]; updated[idx].pricePerNight = Number(e.target.value); setRooms(updated); }}
              />
            </div>
            <div className="flex-1 min-w-[120px] max-w-[160px]">
              <InputField
                name={`maxOccupancy_${idx}`}
                label={<span className="flex items-center gap-2"><FaUser className="text-blue-500" /> Max Occupancy</span>}
                type="number"
                value={room.maxOccupancy?.toString() || ''}
                onChange={e => { const updated = [...rooms]; updated[idx].maxOccupancy = Number(e.target.value); setRooms(updated); }}
              />
            </div>
            <div className="flex-1 min-w-[120px] max-w-[160px]">
              <InputField
                name={`quantity_${idx}`}
                label="Quantity"
                type="number"
                value={room.quantity?.toString() || ''}
                onChange={e => { const updated = [...rooms]; updated[idx].quantity = Number(e.target.value); setRooms(updated); }}
              />
            </div>
            {rooms.length > 1 && <button type="button" onClick={() => setRooms(rooms.filter((_, i) => i !== idx))} className="absolute top-4 right-4 text-red-500 font-bold hover:text-red-700 transition">×</button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomTypeList;
