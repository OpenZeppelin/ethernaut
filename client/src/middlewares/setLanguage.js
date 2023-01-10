import * as actions from '../actions'

const setLanguage = store => next => action => {
    if (action.type !== actions.SET_LANG) return next(action)

    // window.lang = action.lang
    localStorage.setItem('lang', action.lang)
    document.location.reload()

    next(action)
} 

export default setLanguage