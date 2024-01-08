import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { TbTooltip } from 'react-icons/tb'; // Assuming you are using react-icons
import styles from '../styles/DynamicQuestionnaire.module.css'; // Adjust import path

interface TooltipComponentProps {
  content: string;
}

const TooltipComponent: React.FC<TooltipComponentProps> = ({ content }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <TbTooltip />
        </TooltipTrigger>
        <TooltipContent className={styles.tooltipContent}>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipComponent;
