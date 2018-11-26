import * as actions from '../actions'

export default store => next => action => {
    if (action.type !== actions.SET_LANG) return next(action)

    // window.lang = action.lang
    localStorage.setItem('lang', action.lang)

    next(action)
}