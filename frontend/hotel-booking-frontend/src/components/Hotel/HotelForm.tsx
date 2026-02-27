import React from 'react';
import { useHotelForm } from '../../hooks/useHotelForm';
import { useHotelValidation } from '../../hooks/useHotelValidation';
import { GradientButton } from '../Button';
import { ImageUploader, InputField, PhoneField, SelectField } from '../Form';
import { RoomTypeList } from './RoomTypeList';

interface Props {
  hotelId?: number;
  hotelData?: any;
  onSave: (formData: FormData) => Promise<void>;
}

export const HotelForm: React.FC<Props> = ({ hotelId, hotelData, onSave }) => {
  const form = useHotelForm(hotelId, hotelData);
  const { validateHotel } = useHotelValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validateHotel({
      name: form.name,
      address: form.address,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      rooms: form.rooms,
    }, hotelId);

    if (Object.keys(newErrors).length) {
      form.setErrors(newErrors);
      return;
    }

    const convertTime = (t: string) => {
      const [h, m] = t.split(':').map(Number);
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
    };

    const hotelPayload = {
      name: form.name.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      country: form.country.trim(),
      latitude: form.latitude,
      longitude: form.longitude,
      rooms: form.rooms.filter(r => r.quantity > 0),
      description: form.description.trim(),
      contact: form.contact.trim(),
      checkIn: convertTime(form.checkIn),
      checkOut: convertTime(form.checkOut),
    };

    const formData = new FormData();
    formData.append('hotelDetails', JSON.stringify(hotelPayload));
    if (form.image) formData.append('image', form.image);

    try {
      await onSave(formData);
    } catch (err) {
      console.error('Hotel save failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-2xl rounded-3xl p-10 max-w-5xl mx-auto space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <InputField name="name" label="Hotel Name" type="text" value={form.name} onChange={e => form.setName(e.target.value)} required />
        <InputField name="address" label="Address" type="text" value={form.address} onChange={e => form.setAddress(e.target.value)} required />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <InputField name="city" label="City" type="text" value={form.city} readOnly />
        <InputField name="country" label="Country" type="text" value={form.country} readOnly />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <InputField name="latitude" label="Latitude" type="text" value={form.latitude.toString()} readOnly />
        <InputField name="longitude" label="Longitude" type="text" value={form.longitude.toString()} readOnly />
      </div>

      <ImageUploader imagePreview={form.imagePreview} onChange={form.handleImageChange} />

      <div className="grid md:grid-cols-2 gap-6">
        <SelectField label="Check-In Time" name="checkIn" value={form.checkIn} options={form.timeOptions} onChange={e => form.setCheckIn(e.target.value)} />
        <SelectField label="Check-Out Time" name="checkOut" value={form.checkOut} options={form.timeOptions} onChange={e => form.setCheckOut(e.target.value)} />
      </div>

      <InputField name="description" label="Description" type="text" value={form.description} onChange={e => form.setDescription(e.target.value)} placeholder="Brief description" />
      <PhoneField value={form.contact} onChange={form.setContact} label="Contact Number" required />

      {!hotelId && <RoomTypeList rooms={form.rooms} setRooms={form.setRooms} hotelId={hotelId} />}

      <div className="flex justify-end">
        <GradientButton type="submit" className="w-full py-3 text-white font-semibold rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
          {hotelId ? 'Update Hotel' : 'Save Hotel'}
        </GradientButton>
      </div>
    </form>
  );
};

export default HotelForm;