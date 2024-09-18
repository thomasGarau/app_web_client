import { useState } from 'react';

const useErrorPopover = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [errorAnchorEl, setErrorAnchorEl] = useState(null);
  const [id, setId] = useState('');
  const [openAnchor, setOpenAnchor] = useState(false);

  const showErrorPopover = (message, anchorId) => {
    setErrorMessage(message);
    setErrorAnchorEl(document.getElementById(anchorId));
    setId('error-popover');
    setOpenAnchor(true);
  };

  const handleClosePopover = () => {
    setErrorAnchorEl(null);
    setErrorMessage('');
    setOpenAnchor(false);
};

  return { errorMessage, errorAnchorEl, id, openAnchor, showErrorPopover, handleClosePopover };
};

export default useErrorPopover;