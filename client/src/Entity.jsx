import React from 'react'
import './Entity.css'

export function Entity({x, y}) {
  return (
    <div className="entity" style={{left: x, top: y}}>
      &nbsp;
    </div>
  )
}

