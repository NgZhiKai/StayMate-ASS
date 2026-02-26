import { useEffect, useRef, useState } from 'react';
import { RoomRequestDTO } from '../types/Room';
import { OPEN_CAGE_API_KEY } from '../constants/constants';

export const useHotelForm = (hotelId?: number, hotelData?: any) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [description, setDescription] = useState('');
  const [contact, setContact] = useState('');
  const [rooms, setRooms] = useState<RoomRequestDTO[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [prevAddress, setPrevAddress] = useState('');
  const abortControllerRef = useRef<AbortController | null>(null);

  const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
    const h = Math.floor(i / 2);
    const m = i % 2 === 0 ? '00' : '30';
    return { value: `${h.toString().padStart(2,'0')}:${m}`, label: `${h.toString().padStart(2,'0')}:${m}` };
  });

  const fetchCoordinates = async (addr: string) => {
    if (!addr.trim() || addr === prevAddress) return;
    if (abortControllerRef.current) abortControllerRef.current.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(addr)}&key=${OPEN_CAGE_API_KEY}`,
        { signal: controller.signal }
      );
      const data = await res.json();
      const valid = data.results?.[0];

      if (valid) {
        setLatitude(valid.geometry.lat);
        setLongitude(valid.geometry.lng);
        const comp = valid.components;
        const cityValue =
          comp.city ||
          comp.town ||
          comp.village ||
          comp.hamlet ||
          comp.suburb ||
          valid.annotations?.timezone?.name?.split('/')?.[1] ||
          comp.country ||
          '';
        setCity(cityValue);
        setCountry(comp.country || '');
      } else {
        setLatitude(0); setLongitude(0); setCity(''); setCountry('');
      }
      setPrevAddress(addr);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setErrors(prev => ({ ...prev, coordinates: 'Error fetching coordinates' }));
      }
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => fetchCoordinates(address), 500);
    return () => clearTimeout(handler);
  }, [address]);

  // ✅ Properly initialize state when hotelData is available
  useEffect(() => {
    if (!hotelData) {
      if (!hotelId) {
        setRooms([{ roomType: '', pricePerNight: 0, maxOccupancy: 1, quantity: 0 }]);
      }
      return;
    }

    setName(hotelData.name || '');
    setAddress(hotelData.address || '');
    setCity(hotelData.city || '');
    setCountry(hotelData.country || '');
    setLatitude(hotelData.latitude || 0);
    setLongitude(hotelData.longitude || 0);
    setImagePreview(hotelData.image || '');
    
    // Extract HH:mm from hh:mm:ss
    if (hotelData.checkIn) setCheckIn(hotelData.checkIn.slice(0,5));
    if (hotelData.checkOut) setCheckOut(hotelData.checkOut.slice(0,5));

    setDescription(hotelData.description || '');
    setContact(hotelData.contact || '');
    setRooms(hotelData.rooms?.length ? hotelData.rooms : [{ roomType: '', pricePerNight: 0, maxOccupancy: 1, quantity: 0 }]);
    setPrevAddress(hotelData.address || '');
  }, [hotelData, hotelId]);

  const handleImageChange = (file: File) => {
    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  return {
    name, setName,
    address, setAddress,
    city, setCity,
    country, setCountry,
    latitude, longitude,
    image, imagePreview, handleImageChange,
    checkIn, setCheckIn,
    checkOut, setCheckOut,
    description, setDescription,
    contact, setContact,
    rooms, setRooms,
    errors, setErrors,
    timeOptions
  };
};