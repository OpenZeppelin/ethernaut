import React from 'react'
import { loadTranslations } from '../../utils/translations'

const Difficulty = ({level}) => {
  let language = localStorage.getItem('lang')
  let strings = loadTranslations(language)
  return (
    <div>
      <p className="no-margin text-right">
        <small className="text-muted right">{strings.difficulty} {level}/10</small>
      </p>
    </div>
  )
}

export default Difficulty
