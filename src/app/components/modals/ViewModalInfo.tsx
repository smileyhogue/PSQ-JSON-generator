import React from 'react';
import styles from '@/styles/ViewModalInfo.module.css';
import { ModalData } from '@/types/QuestionnaireTypes';

interface ViewModalInfoProps {
  showModal: boolean;
  onClose: () => void;
  modalData: ModalData;
}

const ViewModalInfo: React.FC<ViewModalInfoProps> = ({
  showModal,
  onClose,
  modalData,
}) => {
  if (!showModal) {
    return null;
  }

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Request Details</h3>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.infoRow}>
            <strong>Account Name:</strong> {modalData.accountName}
          </div>
          <div className={styles.infoRow}>
            <strong>Identificaiton Method:</strong>{' '}
            {modalData.jobIdentification}
          </div>
          <div className={styles.infoRow}>
            <strong>Job Detail:</strong> {modalData.jobDetail}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModalInfo;
