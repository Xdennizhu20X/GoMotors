'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  brandColor?: string;
}

export function NotificationModal({
  isOpen,
  onClose,
  title,
  message,
  type = 'info',
  brandColor = '#1341EE'
}: NotificationModalProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      default:
        return '💭';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          iconBg: 'bg-green-100 dark:bg-green-900/20',
          iconColor: 'text-green-600 dark:text-green-400',
          buttonBg: '#10b981'
        };
      case 'error':
        return {
          iconBg: 'bg-red-100 dark:bg-red-900/20',
          iconColor: 'text-red-600 dark:text-red-400',
          buttonBg: '#ef4444'
        };
      case 'warning':
        return {
          iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
          buttonBg: '#f59e0b'
        };
      default:
        return {
          iconBg: 'bg-blue-100 dark:bg-blue-900/20',
          iconColor: 'text-blue-600 dark:text-blue-400',
          buttonBg: brandColor
        };
    }
  };

  const colors = getColors();

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" placement="center">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${colors.iconBg} flex items-center justify-center`}>
              <span className="text-lg">{getIcon()}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {message}
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            onPress={onClose}
            className="text-white font-semibold"
            style={{ backgroundColor: colors.buttonBg }}
          >
            Entendido
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}