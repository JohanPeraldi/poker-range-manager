import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import Message from '@/components/Message/Message';
import { useRange } from '@/contexts/RangeContext';

export const useKeyboardShortcuts = () => {
  const {
    copyRange,
    pasteRange,
    undo,
    redo,
    canUndo,
    canRedo,
    canPaste,
    toggleEditMode,
    setEditMode,
    state: { selectedPosition, isEditMode },
  } = useRange();

  const [message, setMessage] = useState(null);

  // Auto-dismiss success message after 3 seconds
  useEffect(() => {
    if (message?.type === 'success') {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    const handleKeyboardShortcut = async event => {
      // Don't trigger shortcuts if focus is in an input element
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA'
      ) {
        return;
      }

      // Handle non-modifier key shortcuts first
      if (
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !event.shiftKey
      ) {
        switch (event.key.toLowerCase()) {
          case 'e': // Toggle edit mode
            event.preventDefault();
            toggleEditMode();
            setMessage({
              type: 'success',
              content: isEditMode
                ? 'Switched to View Mode'
                : 'Switched to Edit Mode',
            });
            return;

          case 'escape': // Exit edit mode
            if (isEditMode) {
              event.preventDefault();
              setEditMode(false);
              setMessage({
                type: 'success',
                content: 'Switched to View Mode',
              });
            }
            return;

          default:
            break;
        }
      }

      // Edit mode only shortcuts
      if (!isEditMode) {
        return; // Block all other shortcuts in View Mode
      }

      // Get ctrl/cmd key based on platform
      const controlPressed = event.metaKey || event.ctrlKey;

      if (!controlPressed) return;

      switch (event.key.toLowerCase()) {
        case 'c': // Copy (Edit mode only)
          event.preventDefault();
          const copySuccess = await copyRange(selectedPosition);
          setMessage({
            type: copySuccess ? 'success' : 'error',
            content: copySuccess ? 'Range copied' : 'Failed to copy range',
          });
          break;

        case 'v': // Paste (Edit mode only)
          if (canPaste) {
            event.preventDefault();
            await pasteRange(selectedPosition);
          }
          break;

        case 'z': // Undo/Redo (Edit mode only)
          event.preventDefault();
          if (event.shiftKey && canRedo()) {
            await redo();
          } else if (!event.shiftKey && canUndo()) {
            await undo();
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyboardShortcut);
    return () => window.removeEventListener('keydown', handleKeyboardShortcut);
  }, [
    copyRange,
    pasteRange,
    undo,
    redo,
    canUndo,
    canRedo,
    canPaste,
    toggleEditMode,
    setEditMode,
    selectedPosition,
    isEditMode,
  ]);

  return (
    message &&
    createPortal(
      <Message
        type={message.type}
        content={message.content}
        onDismiss={() => setMessage(null)}
      />,
      document.getElementById('message-container')
    )
  );
};
