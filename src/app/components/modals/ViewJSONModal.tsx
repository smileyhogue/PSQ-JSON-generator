import React from 'react';
import styles from '@/styles/JsonViewModal.module.css';
import { Button } from '@/components/ui/button';

export interface JsonViewModalProps {
  show: boolean;
  onClose: () => void;
  jsonData: string;
}

const JsonViewModal: React.FC<JsonViewModalProps> = ({
  show,
  onClose,
  jsonData,
}) => {
  if (!show) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>JSON Data</h3>
          <Button onClick={onClose}>&times;</Button>
        </div>
        <div className={styles.modalContent}>
          <textarea
            className={styles.jsonOutput}
            value={jsonData}
            readOnly
          ></textarea>
        </div>
      </div>
    </div>
  );
};

export default JsonViewModal;
