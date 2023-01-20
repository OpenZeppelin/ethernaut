import * as actions from '../actions'

const setLanguage = store => next => action => {
    if (action.type !== actions.SET_LANG) return next(action)
    localStorage.setItem('lang', action.lang)
    document.location.replace(`${document.location.origin}${document.location.pathname}`)
    next(action)
} 

export default setLanguage