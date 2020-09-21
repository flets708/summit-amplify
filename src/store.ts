import { combineReducers, createStore, compose, applyMiddleware } from 'redux';
import { State, Reducers } from './reducer';
import thunk from 'redux-thunk'

export interface AppState {
    state: State
}

const storeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    combineReducers<AppState>({
        state: Reducers
    }),
    storeEnhancers(applyMiddleware(thunk))
)

export default store