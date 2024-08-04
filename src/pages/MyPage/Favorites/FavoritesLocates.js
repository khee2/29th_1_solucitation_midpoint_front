import React, { useState } from 'react';
import { myPageStyles } from '../../../styles/myPageStyles';
import AddLocationModal from './AddLocationModal';

const FavoritesLocates = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState(false);
  const [locations, setLocations] = useState([
    { name: '집', locate: '', icon: 'homeIcon', type: 'HOME' },
    { name: '직장/학교', locate: '', icon: 'workIcon', type: 'WORK' },
  ]);

  const openAddLocationModal = (location) => {
    setSelectedLocation(location);
    setIsAddLocationModalOpen(true);
  };

  const closeAddLocationModal = () => {
    setIsAddLocationModalOpen(false);
    setSelectedLocation(null);
  };

  const handleAddOrEditLocation = (newLocation) => {
    setLocations((prevLocations) =>
      prevLocations.map((location) =>
        location.type === newLocation.addrType ? { ...location, ...newLocation } : location
      )
    );
    closeAddLocationModal();
  };

  const handleDeleteLocation = (locationToDelete) => {
    setLocations((prevLocations) =>
      prevLocations.map((location) =>
        location.type === locationToDelete.addrType ? { ...location, locate: '' } : location
      )
    );
    closeAddLocationModal();
  };

  return (
    <div style={myPageStyles.favoritesLocateContainer}>
      <h3
        style={{
          padding: '10px',
          textDecoration: 'underline',
          textAlign: 'center',
        }}
      >
        즐겨찾는 장소
      </h3>
      {locations.map((location) => (
        <div
          key={location.type}
          onClick={() => openAddLocationModal(location)}
          style={myPageStyles.locateContainer}
        >
          <img
            src={`/img/${location.icon}.png`}
            width='22'
            height='22'
            alt={location.name}
          />
          {location.name}
          <span style ={myPageStyles.goLocates}>{'>'}</span>
        </div>
      ))}
      {isAddLocationModalOpen && (
        <AddLocationModal
          isOpen={isAddLocationModalOpen}
          closeModal={closeAddLocationModal}
          addLocation={handleAddOrEditLocation}
          editLocation={handleAddOrEditLocation}
          deleteLocation={handleDeleteLocation}
          selectedLocation={selectedLocation}
          loading={false}
        />
      )}
    </div>
  );
};

export default FavoritesLocates;