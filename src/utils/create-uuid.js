import React from 'react'
import { v4 as uuidv4 } from 'uuid';

const createUUID = () => {
  return uuidv4()
}

export default createUUID