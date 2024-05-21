import React from 'react';
import { Modal, Rating, Button } from '@mantine/core';

interface ModalWindowProps {
  opened: boolean;
  onClose: () => void;
  userRating: number | null;
  setUserRating: (rating: number) => void;
  handleSaveRating: () => void;
  handleRemoveRating: () => void;
}

const ModalWindow: React.FC<ModalWindowProps> = ({
  opened,
  onClose,
  userRating,
  setUserRating,
  handleSaveRating,
  handleRemoveRating,
}) => {
  return (
    <Modal opened={opened} onClose={onClose} title="Rate Movie">
      <Rating
        value={userRating as number}
        onChange={setUserRating}
        fractions={1}
        count={10}
        size="xl"
        style={{ position: 'relative', zIndex: '10' }}
      />
      <Button onClick={handleSaveRating} mt="20">
        Save
      </Button>
      {userRating !== null && (
        <Button onClick={handleRemoveRating} mt="20" color="red">
          Remove Rating
        </Button>
      )}
    </Modal>
  );
};

export default ModalWindow;
