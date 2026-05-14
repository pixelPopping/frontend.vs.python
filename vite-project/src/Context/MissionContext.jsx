import React, { createContext } from 'react';

export const MissionContext = createContext(null);


function MissionContextProvider({children}) {
  // hier komt straks de state waarin we de context-data plaatsen

  const data = {
   form: "form"
  }

  return (
    <MissionContext.Provider value={data}>
      // hier komt het component waar we onze eigen provider omheen wikkelen
      {children}
    </MissionContext.Provider>
  )
}

export default MissionContextProvider;