import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HotelCard from '../components/Hotel/HotelCard';
import { useNotificationContext } from "../contexts/NotificationContext";
import { fetchHotels } from '../services/hotelApi';
import { getReviewsForHotel } from '../services/ratingApi';
import { HotelData } from '../types/Hotels';

const HomePage: React.FC = () => {
  const [hotels, setHotels] = useState<HotelData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const hotelsPerPage = 8;
  const { refreshNotifications } = useNotificationContext();

  const userId = sessionStorage.getItem('userId');
  const userRole = sessionStorage.getItem('role');
  const isAdmin = userId && userRole === 'admin';
  const navigate = useNavigate();

  useEffect(() => {
    refreshNotifications();

    const loadHotels = async () => {
      try {
        const hotelData = await fetchHotels();
        if (!Array.isArray(hotelData)) throw new Error('Invalid data format');

        const hotelsWithRatings = await Promise.all(
          hotelData.map(async hotel => {
            const reviews = await getReviewsForHotel(hotel.id);
            const averageRating = reviews.length
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              : 0;
            return { ...hotel, averageRating };
          })
        );

        setHotels(hotelsWithRatings);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load hotels. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadHotels();
  }, []);

  const handleCreateHotel = () => navigate('/create-hotel');

  // Pagination
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = hotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(hotels.length / hotelsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-md py-16 px-6 md:px-20 text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Welcome to StayMate
        </h1>
        <p className="text-gray-600 text-lg">
          Explore the best hotels curated for you
        </p>

        {isAdmin && (
          <button
            onClick={handleCreateHotel}
            className="fixed bottom-6 right-6 bg-blue-600 text-white px-5 py-3 rounded-full shadow-lg hover:bg-blue-700 hover:scale-105 transition-all z-50"
          >
            Create Hotel
          </button>
        )}
      </div>

      {/* Hotel List */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Recommended Hotels</h2>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: hotelsPerPage }).map((_, idx) => (
              <div key={idx} className="animate-pulse bg-white h-64 rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : hotels.length === 0 ? (
          <p>No hotels available at the moment.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentHotels.map(hotel => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 items-center gap-2 flex-wrap">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === 1 ? 'bg-gray-300 text-gray-800' : 'bg-blue-600 text-white'
                  }`}
                >
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-800'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md ${
                    currentPage === totalPages ? 'bg-gray-300 text-gray-800' : 'bg-blue-600 text-white'
                  }`}
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;