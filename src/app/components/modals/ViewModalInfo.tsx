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
          <h3>Modal Information</h3>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>
        <div className={styles.modalContent}>
          <div className={styles.infoRow}>
            <strong>Account Name:</strong> {modalData.accountName}
          </div>
          <div className={styles.infoRow}>
            <strong>Request Type:</strong> {modalData.requestType}
          </div>
          <div className={styles.infoRow}>
            <strong>Same Affiliate:</strong>{' '}
            {modalData.sameAffiliate ? 'Yes' : 'No'}
          </div>
          <div className={styles.infoRow}>
            <strong>Apply Method:</strong> {modalData.campaignType}
          </div>
          <div className={styles.infoRow}>
            <strong>Campaigns:</strong>
            <ul className={styles.infoList}>
              {modalData.campaigns.map((campaign, index) => (
                <li key={index}>{campaign}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewModalInfo;
