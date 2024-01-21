import React, { useEffect, useState } from 'react';
import styles from '@/styles/ShareModal.module.css';
import { ModalData } from '@/types/QuestionnaireTypes';

export interface RequestInfoModalProps {
  show: boolean;
  onClose: () => void;
  onCopyURL: (data: any) => void;
  initialData: ModalData;
}

const ShareModal: React.FC<RequestInfoModalProps> = ({
  show,
  onClose,
  onCopyURL,
  initialData,
}) => {
  const [accountName, setAccountName] = useState(initialData.accountName);
  const [jobIdentification, setJobIdentification] = useState(
    initialData.jobIdentification || ''
  );
  const [jobDetail, setJobDetail] = useState(initialData.jobDetail || '');

  useEffect(() => {
    setAccountName(initialData.accountName);
    setJobIdentification(initialData.jobIdentification || '');
    setJobDetail(initialData.jobDetail || '');
  }, [initialData]);

  const handleSubmit = () => {
    const data = {
      accountName,
      jobIdentification,
      jobDetail,
    };
    onCopyURL(data);
  };

  if (!show) {
    return null;
  }

  const renderJobDetailInput = () => {
    switch (jobIdentification) {
      case 'Hashtag':
      case 'Job category':
      case 'Something Else':
        return (
          <>
            <label htmlFor="text" className={styles.label}>
              {jobIdentification}
            </label>
            <input
              id="text"
              type="text"
              value={jobDetail}
              onChange={(e) => setJobDetail(e.target.value)}
              className={styles.input}
            />
          </>
        );
      case 'List of Job IDs':
      case 'Job titles':
        return (
          <>
            <label htmlFor="textarea" className={styles.label}>
              {jobIdentification}
            </label>

            <textarea
              id="textarea"
              value={jobDetail}
              onChange={(e) => setJobDetail(e.target.value)}
              className={styles.input}
            />
          </>
        );
      default:
        return null;
    }
  };

  if (!show) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h3>Request Information</h3>
          <button onClick={onClose} className={styles.closeButton}>
            &times;
          </button>
        </div>
        <div className={styles.modalContent}>
          <label htmlFor="accountName" className={styles.label}>
            Account Name
          </label>
          <input
            id="accountName"
            type="text"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            className={styles.input}
          />
          <label htmlFor="jobIdentification" className={styles.label}>
            Job Identification
          </label>
          <select
            id="jobIdentification"
            value={jobIdentification}
            onChange={(e) => setJobIdentification(e.target.value)}
            className={styles.select}
          >
            <option value="">Select Job Identification</option>
            <option value="Hashtag">Hashtag</option>
            <option value="List of Job IDs">List of Job IDs</option>
            <option value="Job titles">Job Titles</option>
            <option value="Job category">Job Category</option>
            <option value="Something Else">Something Else</option>
            <option value="All Jobs">All Jobs</option>
          </select>

          {renderJobDetailInput()}

          <button onClick={handleSubmit} className={styles.submitButton}>
            Generate Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
