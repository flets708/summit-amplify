import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { Actions } from './action'

export interface SelectedPhoto {
    src: string,
    name: string,
    type: string,
}

export interface SelectedPhotoLabel {
    name: string,
    confidence: number
}

export interface PhotoList {
    filename: string,
    url: string,
    labels: string[],
    capitalLetter: string,
    lastModified: Date,
    username: string,
    expanded: boolean,
    desc: string
}

export interface State {
    selectedPhoto: SelectedPhoto,
    selectedPhotoLabels: SelectedPhotoLabel[],
    selectedPhotoLabelsJson: string,
    menu: number,
    modal: boolean,
    username: string,
    desc: string,
    photoList: PhotoList[],
    labelProgress: boolean,
}

const initialState: State = {
    selectedPhoto: {
        src: "",
        name: "",
        type: "", 
    },
    selectedPhotoLabels: [],
    selectedPhotoLabelsJson: '',
    menu: 0,
    modal: false,
    username: '',
    desc: '',
    photoList: [],
    labelProgress: true
}

export const Reducers = reducerWithInitialState(initialState)
    .case(Actions.updateSelectPhoto, (state, selectedPhoto) => {
        return Object.assign({}, state, { selectedPhoto })
    })
    .case(Actions.updateSelectPhotoLabels, (state, selectedPhotoLabels) => {
        return Object.assign({}, state, { selectedPhotoLabels })
    })
    .case(Actions.updateSelectPhotoLabelsJson, (state, selectedPhotoLabelsJson) => {
        return Object.assign({}, state, { selectedPhotoLabelsJson })
    })
    .case(Actions.updateMenu, (state, menu) => {
        return Object.assign({}, state, { menu })
    })
    .case(Actions.updateModal, (state, modal) => {
        return Object.assign({}, state, { modal })
    })
    .case(Actions.updateUserName, (state, username) => {
        return Object.assign({}, state, { username })
    })
    .case(Actions.updateDescription, (state, desc) => {
        return Object.assign({}, state, { desc })
    })
    .case(Actions.updatePhotoList, (state, photoList) => {
        return Object.assign({}, state, { photoList })
    })
    .case(Actions.updateLabelProgress, (state, labelProgress) => {
        return Object.assign({}, state, { labelProgress })
    })
