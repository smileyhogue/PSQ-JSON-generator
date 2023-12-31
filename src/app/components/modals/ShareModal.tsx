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
  const [requestType, setRequestType] = useState(initialData.requestType);
  const [sameAffiliate, setSameAffiliate] = useState(initialData.sameAffiliate);
  const [campaignType, setCampaignType] = useState(initialData.campaignType);
  const [campaigns, setCampaigns] = useState(initialData.campaigns || ['']);

  useEffect(() => {
    setAccountName(initialData.accountName);
    setRequestType(initialData.requestType);
    setSameAffiliate(initialData.sameAffiliate);
    setCampaignType(initialData.campaignType);
    setCampaigns(initialData.campaigns || ['']);
  }, [initialData]);

  const handleAddCampaign = () => {
    setCampaigns([...campaigns, '']);
  };

  const handleCampaignChange = (index: number, value: string) => {
    const updatedCampaigns = [...campaigns];
    updatedCampaigns[index] = value;
    setCampaigns(updatedCampaigns);
  };

  const handleSubmit = () => {
    const data = {
      accountName,
      requestType,
      sameAffiliate,
      campaignType,
      campaigns,
    };
    onCopyURL(data);
  };

  if (!show) {
    return null;
  }

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
          <div className={styles.leftColumn}>
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

            <label htmlFor="requestType" className={styles.label}>
              Request Type
            </label>
            <select
              id="requestType"
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              className={styles.select}
            >
              <option value="">Select Request Type</option>
              <option value="New Launch">New Launch</option>
              <option value="Existing Campaign">Existing Campaign</option>
            </select>

            <label htmlFor="sameAffiliate" className={styles.label}>
              Same Affiliate?
            </label>
            <select
              id="sameAffiliate"
              value={sameAffiliate}
              onChange={(e) => setSameAffiliate(e.target.value)}
              className={styles.select}
            >
              <option value="">Select Affiliate Status</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>

            <label htmlFor="campaignType" className={styles.label}>
              Campaign Type
            </label>
            <select
              id="campaignType"
              value={campaignType}
              onChange={(e) => setCampaignType(e.target.value)}
              className={styles.select}
            >
              <option value="">Select Campaign Type</option>
              <option value="PandoLogic + Easy Apply">
                PandoLogic + Easy Apply
              </option>
              <option value="A supported ATS">A supported ATS</option>
            </select>
          </div>

          <div className={styles.rightColumn}>
            <label className={styles.label}>Campaigns</label>
            <div className={styles.campaignContainer}>
              {campaigns.map((campaign, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Campaign ${index + 1}`}
                  value={campaign}
                  onChange={(e) => handleCampaignChange(index, e.target.value)}
                  className={styles.input}
                />
              ))}
              <button onClick={handleAddCampaign} className={styles.addButton}>
                Add Campaign
              </button>
            </div>
          </div>
        </div>

        <button onClick={handleSubmit} className={styles.submitButton}>
          Copy Shareable URL
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
