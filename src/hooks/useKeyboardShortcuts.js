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
    state: { selectedPosition },
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

      // Get ctrl/cmd key based on platform
      const controlPressed = event.metaKey || event.ctrlKey;

      if (!controlPressed) return;

      switch (event.key.toLowerCase()) {
        case 'c': // Copy
          event.preventDefault();
          const copySuccess = await copyRange(selectedPosition);
          setMessage({
            type: copySuccess ? 'success' : 'error',
            content: copySuccess ? 'Range copied' : 'Failed to copy range',
          });
          break;

        case 'v': // Paste
          if (canPaste) {
            event.preventDefault();
            await pasteRange(selectedPosition);
          }
          break;

        case 'z': // Undo/Redo
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
    selectedPosition,
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
