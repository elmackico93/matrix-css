import { ReactNode } from 'react';

export interface ModalProps {
  /**
   * Whether the modal is visible
   */
  isOpen: boolean;
  
  /**
   * Function to call when the modal should close
   */
  onClose: () => void;
  
  /**
   * The content of the modal
   */
  children: ReactNode;
  
  /**
   * Additional CSS classes to apply to the modal container
   */
  className?: string;
  
  /**
   * Whether to show a close button in the top-right corner
   * @default true
   */
  showCloseButton?: boolean;
  
  /**
   * Whether to close the modal when clicking on the backdrop
   * @default true
   */
  closeOnBackdropClick?: boolean;
}

export interface ModalHeaderProps {
  /**
   * The content of the modal header
   */
  children: ReactNode;
  
  /**
   * Additional CSS classes to apply to the header
   */
  className?: string;
}

export interface ModalBodyProps {
  /**
   * The content of the modal body
   */
  children: ReactNode;
  
  /**
   * Additional CSS classes to apply to the body
   */
  className?: string;
}

export interface ModalFooterProps {
  /**
   * The content of the modal footer
   */
  children: ReactNode;
  
  /**
   * Additional CSS classes to apply to the footer
   */
  className?: string;
}