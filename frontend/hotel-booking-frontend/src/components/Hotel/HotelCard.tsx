import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Box, Rating, Chip, Button } from '@mui/material';
import { HotelData } from '../../types/Hotels';
import { useNavigate } from 'react-router-dom';

interface HotelCardProps {
  hotel: HotelData;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const navigate = useNavigate();
  const defaultImage = 'https://archive.org/download/placeholder-image/placeholder-image.jpg';
  const minPrice = Math.min(...hotel.rooms.map(room => room.pricePerNight));
  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setShowFullDescription(prev => !prev);
  };

  return (
    <Card
      onClick={() => navigate(`/hotel/${hotel.id}`)}
      sx={{
        display: 'flex',
        cursor: 'pointer',
        borderRadius: 2,
        overflow: 'hidden',
        boxShadow: 2,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': { transform: 'translateY(-3px)', boxShadow: 4 },
        height: 160,
      }}
    >
      {/* LEFT: IMAGE */}
      <Box sx={{ position: 'relative', width: 160, flexShrink: 0 }}>
        <CardMedia
          component="img"
          image={hotel.image ? `data:image/jpeg;base64,${hotel.image}` : defaultImage}
          alt={hotel.name}
          sx={{ height: '100%', width: '100%', objectFit: 'cover' }}
        />
        <Chip
          label={`$${minPrice}/night`}
          size="small"
          sx={{
            position: 'absolute',
            bottom: 6,
            left: 6,
            fontWeight: 'bold',
            fontSize: '0.65rem',
            backgroundColor: 'rgba(33, 150, 243, 0.85)',
            color: '#fff',
            height: 20,
            px: 0.5
          }}
        />
      </Box>

      {/* RIGHT: CONTENT */}
      <CardContent sx={{ flex: 1, p: 1.5, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="subtitle2" fontWeight={500}>
            {hotel.name}
          </Typography>

          {/* Address - wraps nicely */}
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', mt: 0.25, lineHeight: 1.2 }}>
            {hotel.address}
          </Typography>

          {/* Rating */}
          <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
            <Rating value={hotel.averageRating || 0} readOnly precision={0.1} size="small" />
            <Typography variant="caption" color="text.secondary">
              {hotel.averageRating?.toFixed(1) || '0.0'}
            </Typography>
          </Box>

          {/* Description */}
          {hotel.description && (
            <>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  fontSize: '0.7rem',
                  lineHeight: 1.2,
                  display: '-webkit-box',
                  WebkitLineClamp: showFullDescription ? 3 : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {hotel.description}
              </Typography>

              {hotel.description.length > 80 && (
                <Button
                  onClick={toggleDescription}
                  size="small"
                  sx={{ textTransform: 'none', p: 0, mt: 0.25, fontSize: '0.65rem', color: 'primary.main' }}
                >
                  {showFullDescription ? 'Show less' : 'Show more'}
                </Button>
              )}
            </>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default HotelCard;