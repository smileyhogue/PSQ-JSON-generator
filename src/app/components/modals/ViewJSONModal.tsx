import React, { useState } from 'react';
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
  const [buttonText, setButtonText] = useState('Copy JSON');
  const [buttonColor, setButtonColor] = useState('#35B0C9');

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonData);
      setButtonColor('#96C13C'); // Green color for success
      setButtonText('JSON Copied!');
      setTimeout(() => {
        setButtonColor('#35B0C9'); // Revert color after 2 seconds
        setButtonText('Copy JSON'); // Revert text after 2 seconds
      }, 2000);
    } catch (err) {
      console.error('Failed to copy JSON: ', err);
      setButtonColor('#ff4d4f'); // Red color for error
      setButtonText('Error');
      setTimeout(() => {
        setButtonColor('#35B0C9'); // Revert color after 2 seconds
        setButtonText('Copy JSON'); // Revert text after 2 seconds
      }, 2000);
    }
  };

  if (!show) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>JSON Data</h3>
          <div>
            <Button
              onClick={handleCopyJson}
              style={{
                backgroundColor: buttonColor,
                transition: 'background-color 0.3s',
              }}
            >
              {buttonText}
            </Button>
            <Button onClick={onClose}>&times;</Button>
          </div>
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
