import { connect } from "react-redux";
import store, { AppState } from './store'
import { ServerlessAlbumComponent } from "./serverlessAlbumComponent";
import { Dispatch } from "redux";
import { Actions } from "./action";
import Amplify, { Auth, Storage, Predictions } from 'aws-amplify';
import awsconfig from './aws-exports';
import { SelectedPhoto, SelectedPhotoLabel, PhotoList } from './reducer'
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';

Amplify.configure(awsconfig);
Storage.configure({ level: 'private' });
Amplify.addPluggable(new AmazonAIPredictionsProvider());

export interface ServerlessAlbumHandler {
    handleGetPhotoList(): void
    handleModalOpen(): void
    handleModalClose(): void
    handleSetCurrentSession(): void
    handleSelectdPhotoImageSrc(e: React.ChangeEvent<HTMLInputElement>): void
    handleUploadPhotoImage(selectedPhoto: SelectedPhoto): void
    handleUploadDescription(description: string): void
    handleUpdateExpanded(index: number, photoList: PhotoList[]): void
    handleUploadMenu(menu: number): void
}

const handleSetCurrentSession = () => (dispatch: Dispatch) => {
    Auth.currentSession()
        .then(data => {
            dispatch(Actions.updateUserName(data["accessToken"]["payload"]["username"]))
        })
        .catch(err => console.log(err));
}

const handleModalOpen = () => (dispatch: Dispatch) => {
    dispatch(Actions.updateModal(true))
}

const handleModalClose = () => (dispatch: Dispatch) => {
    dispatch(Actions.updateModal(false))
}

const handleGetPhotoList = () => (dispatch: Dispatch) => {
    let photoLists: PhotoList[] = []
    Storage.list('', { level: 'public' })
        .then(s3List => {
            s3List.sort((a, b) => (a.id > b.id ? 1 : -1));
            s3List.map((s3) => {
                return Storage.get(s3.key, { level: 'public', download: true })
                    .then(s3Get => {
                        const fn = decodeURIComponent(escape(window.atob(s3Get["Metadata"].filename)))
                        const maxLength = 25
                        const filename = fn.length > maxLength ? fn.substring(0, maxLength - 3) + '...' : fn
                        const labels = JSON.parse(s3Get["Metadata"].labels)
                        const desc = s3Get["Metadata"].description === undefined ? "" : decodeURIComponent(escape(window.atob(s3Get["Metadata"].description)))
                        const photoList: PhotoList = {
                            filename: filename,
                            url: URL.createObjectURL(new Blob([s3Get["Body"]], { type: s3Get['ContentType'] })),
                            labels: labels,
                            capitalLetter: decodeURIComponent(escape(window.atob(s3Get["Metadata"].capitalletter))),
                            lastModified: s3.lastModified,
                            username: s3Get["Metadata"].username,
                            expanded: false,
                            desc: desc
                        }
                        photoLists = photoLists.concat(photoList)
                        dispatch(Actions.updatePhotoList(photoLists))
                    })
                    .catch(err => console.log(err));
            })
        })
        .catch(err => console.log(err))
}

const handleSelectdPhotoImageSrc = (e: React.ChangeEvent<HTMLInputElement>) => (dispatch: Dispatch) => {
    dispatch(Actions.updateLabelProgress(true))
    const file = e.target.files![0]
    const imageUrl = URL.createObjectURL(file);
    const selectPhoto: SelectedPhoto = {
        src: imageUrl,
        name: file.name,
        type: file.type,
    }
    dispatch(Actions.updateSelectPhoto(selectPhoto))
    dispatch(Actions.updateModal(true))

    Predictions.identify({
        labels: {
            source: {
                file,
            },
            type: "ALL" // "LABELS" will detect objects , "UNSAFE" will detect if content is not safe, "ALL" will do both default on aws-exports.js
        }
    }).then(result => {
        const photoLabels = JSON.parse(JSON.stringify(result, null, 2))
        const labels = photoLabels.labels.map((label) => {
            const photoLabel: SelectedPhotoLabel = {
                name: label.name,
                confidence: label.metadata.confidence
            }
            return photoLabel
        })
        dispatch(Actions.updateSelectPhotoLabels(labels))
        dispatch(Actions.updateLabelProgress(false))
    }).catch(err => {
        console.log(err)
        dispatch(Actions.updateLabelProgress(false))
    })
}

const handleUploadDescription = (desc: string) => (dispatch: Dispatch) => {
    dispatch(Actions.updateDescription(desc))
}

const handleUpdateExpanded = (index: number, photoList: PhotoList[]) => (dispatch: Dispatch) => {
    let photoLists: PhotoList[] = []
    if (photoList[index].expanded) {
        photoList[index].expanded = false
    } else {
        photoList[index].expanded = true
    }
    dispatch(Actions.updatePhotoList(photoLists.concat(photoList)))
}

const handleUploadPhotoImage = (selectedPhoto: SelectedPhoto) => (dispatch: Dispatch) => {
    const now = new Date();
    const filename = now.getTime() + '_' + selectedPhoto.name
    const files = document.getElementById('photo') as HTMLInputElement
    const file = files.files![0]
    const labels: string = JSON.stringify(store.getState().state.selectedPhotoLabels)
    Storage.put(filename, file, {
        level: 'public',
        contentType: selectedPhoto.type,
        metadata: {
            filename: btoa(unescape(encodeURIComponent(selectedPhoto.name))),
            username: store.getState().state.username,
            description: btoa(unescape(encodeURIComponent(store.getState().state.desc))),
            labels: labels,
            capitalletter: btoa(unescape(encodeURIComponent(selectedPhoto.name.slice(0, 1))))
        }
    })
        .then(result => {
            alert("Uploading succeeded");
            const selectPhoto: SelectedPhoto = {
                name: '',
                src: '',
                type: ''
            }
            dispatch(Actions.updateSelectPhoto(selectPhoto))
            dispatch(Actions.updateDescription(''))
            dispatch(Actions.updateModal(false))
            handleGetPhotoList()
        })
        .catch(err => {
            console.log(err);
            alert("Err: " + err);
        })
}

const handleUploadMenu = (menu: number) => (dispatch: Dispatch) => {
    dispatch(Actions.updateMenu(menu))
}

const mapStateToProps = (appState: AppState) => {
    return Object.assign({}, appState.state, {
        selectedPhotoImageSrc: appState.state.selectedPhoto
    })
}

export default connect(mapStateToProps, {
    handleGetPhotoList,
    handleModalOpen,
    handleModalClose,
    handleSetCurrentSession,
    handleSelectdPhotoImageSrc,
    handleUploadPhotoImage,
    handleUploadDescription,
    handleUpdateExpanded,
    handleUploadMenu
})(ServerlessAlbumComponent)
