import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Rating,
  Chip
} from '@mui/material';
import { HotelData } from '../../types/Hotels';
import { Link } from 'react-router-dom';

interface HotelCardProps {
  hotel: HotelData;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel }) => {
  const defaultImage = 'https://archive.org/download/placeholder-image/placeholder-image.jpg';
  const minPrice = Math.min(...hotel.rooms.map(room => room.pricePerNight));

  return (
    <Link to={`/hotel/${hotel.id}`} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          maxWidth: 280,
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: 3,
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: 6
          }
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            image={hotel.image ? `data:image/jpeg;base64,${hotel.image}` : defaultImage}
            alt={hotel.name}
            sx={{
              height: 150,
              width: '100%',
              objectFit: 'cover',
              transition: 'opacity 0.5s ease-in-out'
            }}
          />
          {/* Price badge */}
          <Chip
            label={`From $${minPrice}/night`}
            color="primary"
            size="small"
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 8,
              fontWeight: 'bold',
              backgroundColor: 'rgba(33, 150, 243, 0.9)',
              color: '#fff'
            }}
          />
        </Box>

        <CardContent sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 0.5, flexGrow: 1 }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            noWrap
            sx={{ fontSize: { xs: '0.95rem', sm: '1rem' } }}
          >
            {hotel.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
          >
            {hotel.address}
          </Typography>

          <Box display="flex" alignItems="center" gap={0.5} mt={0.5}>
            <Rating value={hotel.averageRating || 0} readOnly precision={0.1} size="small" />
            <Typography variant="caption">
              {hotel.averageRating?.toFixed(1) || '0.0'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

export default HotelCard;