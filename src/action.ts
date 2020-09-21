import actionCreatorFactory, { } from 'typescript-fsa'
import {SelectedPhoto, PhotoList} from './reducer'

const actionCreator = actionCreatorFactory()

export const Actions = {
    updateSelectPhoto: actionCreator<SelectedPhoto>('UPDATE_SELECT_PHOTO'),
    updateSelectPhotoLabels: actionCreator<[]>('UPDATE_SELECT_PHOTO_LABELS'),
    updateSelectPhotoLabelsJson: actionCreator<string>('UPDATE_SELECT_PHOTO_LABELS_JSON'),
    updateMenu: actionCreator<number>('UPDATE_MENU'),
    updateModal: actionCreator<boolean>('UPDATE_MODAL'),
    updateUserName: actionCreator<string>('UPDATE_USERNAME'),
    updateDescription: actionCreator<string>('UPDATE_DESCRIPTION'),
    updatePhotoList: actionCreator<PhotoList[]>('UPDATE_PHOTO_LIST'),
    updateLabelProgress: actionCreator<boolean>('UPDATE_LABEL_PROGRESS'),
}