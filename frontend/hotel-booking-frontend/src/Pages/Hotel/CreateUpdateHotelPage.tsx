import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HotelForm } from '../../components/Hotel';
import { HeroSection } from '../../components/Misc';
import { MessageModal } from '../../components/Modal';
import { hotelApi } from '../../services/Hotel';

interface ModalState {
  message: string;
  type: 'success' | 'error';
  isOpen: boolean;
}

const CreateUpdateHotelPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  const [hotelData, setHotelData] = useState<any>(null);
  const [modal, setModal] = useState<ModalState>({ message: '', type: 'success', isOpen: false });

  // Fetch hotel data if updating
  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const data = await hotelApi.fetchHotelById(Number(id));
        setHotelData(data);
      } catch (error) {
        console.error('Failed to fetch hotel data:', error);
        setModal({ message: 'Failed to fetch hotel data.', type: 'error', isOpen: true });
      }
    })();
  }, [id]);

  const handleSaveHotel = async (formData: FormData) => {
    try {
      if (id) await hotelApi.updateHotel(Number(id), formData);
      else await hotelApi.createHotel(formData);

      setModal({ message: id ? 'Hotel updated successfully!' : 'Hotel created successfully!', type: 'success', isOpen: true });

      setTimeout(() => {
        setModal(prev => ({ ...prev, isOpen: false }));
        navigate('/');
      }, 2500);
    } catch (error) {
      console.error('Failed to save hotel:', error);
      setModal({ message: 'Failed to save hotel data.', type: 'error', isOpen: true });
    }
  };

  const closeModal = () => setModal(prev => ({ ...prev, isOpen: false }));

  return (
    <div className="min-h-screen bg-gray-50 select-none">
      <HeroSection
        title={id ? 'Update Your Hotel' : 'Create Your Hotel'}
        highlight="Hotel"
        description={
          id
            ? 'Modify your property details and manage room types.'
            : 'Add a new property and start accepting bookings.'
        }
        align="left"
        padding="lg"
      />

      <div className="max-w-6xl mx-auto px-6 mt-12 pb-32">
        <HotelForm hotelId={id ? Number(id) : undefined} hotelData={hotelData} onSave={handleSaveHotel} />
      </div>

      <MessageModal isOpen={modal.isOpen} onClose={closeModal} message={modal.message} type={modal.type} />
    </div>
  );
};

export default CreateUpdateHotelPage;