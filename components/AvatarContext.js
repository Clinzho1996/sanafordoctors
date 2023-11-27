/* eslint-disable prettier/prettier */
import React, {createContext, useContext, useState} from 'react';

const AvatarContext = createContext();

export const AvatarProvider = ({children}) => {
  const [avatarUri, setAvatarUri] = useState(null);

  return (
    <AvatarContext.Provider value={{avatarUri, setAvatarUri}}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => {
  return useContext(AvatarContext);
};
