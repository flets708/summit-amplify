import React, { useEffect } from 'react'
import { Modal, Button, makeStyles, Typography, Grid, Card, CardMedia, CardContent, CardHeader, Avatar, Fab, List, ListItem, ListItemIcon, ListItemText, TextField, CardActions, Theme, createStyles, Collapse, AppBar, Toolbar, CircularProgress } from '@material-ui/core'
import { State } from './reducer'
import { ServerlessAlbumHandler } from './serverlessAlbumContainer'
import { AmplifySignOut } from '@aws-amplify/ui-react'
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import SendIcon from '@material-ui/icons/Send';
import moment from 'moment'
import LabelIcon from '@material-ui/icons/Label';
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        PhotoUpdate: {
            backgroundColor: '#fff',
            textAlign: 'center',
            padding: 0,
            width: '95%',
            maxWidth: 1024,
            maxHeight: '95%',
            margin: 'auto',
            marginTop: 20,
            overflow: 'scroll',
            '& img': {
                width: 'auto',
                height: 'auto',
                maxWidth: 350,
                maxHeight: 500
            }
        },
        InputFileButton: {
            '& input': {
                opacity: 0,
                appearance: 'none',
                position: 'absolute',
            },
            '& svg': {
                color: '#fff'
            }
        },
        PhotoListsCard: {
            maxWidth: 600,
            margin: '10px',
            backgroundColor: '#272c34',
        },
        CardHeader: {
            '& span': {
                color: '#fff',
            }
        },
        media: {
            height: 140,
            backgroundSize: 'contain',
        },
        avatar: {
            backgroundColor: red[500],
        },
        PhotoLists: {
            padding: '10px 0'
        },
        uploadButton: {
            padding: 10,
            '&>*': {
                margin: 10,
            },
            '& label': {
                padding: 10
            },
            '& svg': {
                color: '#fff'
            },
            '& span': {
                color: '#fff'
            }
        },
        expand: {
            transform: 'rotate(0deg)',
            marginLeft: 'auto',
            transition: theme.transitions.create('transform', {
                duration: theme.transitions.duration.shortest,
            }),
            color: 'white'
        },
        expandOpen: {
            transform: 'rotate(180deg)',
        },
        AppBarTitle: {
            flexGrow: 1,
        },
        SignOut: {
            '& .button': {
                backgroundColor: 'red',
            }
        },
        LabelHeader: {
            color: '#a6e22e'
        },
        LabelBody: {
            color: '#fff'
        },
        fab: {
            position: 'fixed',
            bottom: theme.spacing(5),
            right: theme.spacing(5),
        },
    })
);

type Props = State & ServerlessAlbumHandler

export const ServerlessAlbumComponent: React.FC<Props> = (props: Props) => {
    useEffect(
        () => {
            props.handleSetCurrentSession()
            props.handleGetPhotoList()
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    )
    const classes = useStyles();
    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" className={classes.AppBarTitle}>Serverless Album</Typography>
                    <AmplifySignOut className={classes.SignOut} button-text="Custom Text"></AmplifySignOut>
                </Toolbar>
            </AppBar>
            <Fab color="secondary" className={classes.fab} aria-label="add">
                <Button
                    component="label"
                    variant="text"
                    className={classes.InputFileButton}
                >
                    <AddIcon />
                    <input
                        onChange={(e) => { props.handleSelectdPhotoImageSrc(e) }}
                        type="file"
                        accept="image/*"
                        id="photo"
                    /></Button>
            </Fab>
            <Modal
                open={props.modal}
                onClose={() => props.handleModalClose()}
            >
                <div className={classes.PhotoUpdate}>
                    <Grid className={classes.PhotoUpdate} container>
                        <Grid item xs={12} sm={6}>
                            <img
                                className={classes.media}
                                src={props.selectedPhoto.src}
                                alt={props.selectedPhoto.name}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>

                            <div>
                                <Typography variant="h6" align="justify" className={classes.LabelHeader}>Metadata</Typography>
                                <TextField
                                    color="primary"
                                    disabled
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    label="User Name"
                                    value={props.username}
                                />
                                <TextField
                                    color="primary"
                                    disabled
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    label="File Name"
                                    value={props.selectedPhoto.name}
                                />
                                <TextField
                                    color="primary"
                                    fullWidth
                                    variant="outlined"
                                    margin="normal"
                                    label="Description"
                                    onChange={(e) => { props.handleUploadDescription(e.target.value) }}
                                    value={props.desc}
                                />
                                {props.labelProgress ?
                                    <CircularProgress color="secondary" />
                                    :
                                    <>
                                        {props.selectedPhotoLabels.length ?
                                            <>
                                                <Typography variant="h6" align="justify" className={classes.LabelHeader}>Labels</Typography>
                                                <List>
                                                    {props.selectedPhotoLabels.map((label, key) => {
                                                        return <ListItem key={key}>
                                                            <ListItemIcon><LabelIcon /></ListItemIcon>
                                                            <ListItemText primary={label.name} secondary={"confidence:" + label.confidence} />
                                                        </ListItem>
                                                    })}
                                                </List>
                                            </>
                                            :
                                            <Typography variant="h6" align="justify" color="primary">Labelがつけられませんでした</Typography>
                                        }
                                    </>
                                }
                            </div>
                            <div className={classes.uploadButton}>
                                <Fab
                                    variant="extended"
                                    color="secondary"
                                    aria-label="add"
                                    onClick={() => props.handleUploadPhotoImage(props.selectedPhoto)}
                                >
                                    <SendIcon />
                                    アップロード
                                    </Fab>

                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Modal>

            <Grid className={classes.PhotoLists} container>
                {props.photoList.map((photo, index) => {
                    return <Grid key={index} item xs={12} sm={6} md={4} lg={3} xl={2} >
                        <Card className={classes.PhotoListsCard}>
                            <CardHeader
                                avatar={
                                    <Avatar aria-label="recipe" className={classes.avatar}>{photo.capitalLetter}</Avatar>
                                }
                                title={photo.filename}
                                subheader={moment(photo.lastModified).format("YYYY-MM-DD HH:mm:ss")}
                                className={classes.CardHeader}
                            />
                            <CardMedia
                                className={classes.media}
                                image={photo.url}
                                title={props.selectedPhoto.name}
                            />
                            <CardActions disableSpacing>
                                <IconButton
                                    className={clsx(classes.expand, {
                                        [classes.expandOpen]: props.photoList[index].expanded,
                                    })}
                                    onClick={() => { props.handleUpdateExpanded(index, props.photoList) }}
                                    aria-expanded={props.photoList[index].expanded}
                                    aria-label="show more"
                                >
                                    <ExpandMoreIcon />
                                </IconButton>
                            </CardActions>
                            <Collapse in={props.photoList[index].expanded} timeout="auto" unmountOnExit>
                                <CardContent>
                                    {((photo.desc).length > 0) &&
                                        <>
                                            <Typography className={classes.LabelHeader} variant="h6" color="textSecondary">Description</Typography>
                                            <Typography className={classes.LabelBody} variant="subtitle1" color="textSecondary">{photo.desc}</Typography>
                                        </>
                                    }

                                    <Typography className={classes.LabelHeader} variant="h6" color="textSecondary">Labels</Typography>
                                    {photo.labels.map((label, key) => {
                                        return <Typography key={key} variant="subtitle1" className={classes.LabelBody} color="textSecondary">{label["name"]} {label["confidence"]}</Typography>
                                    })}
                                </CardContent>
                            </Collapse>
                        </Card>
                    </Grid>
                })}
            </Grid>
        </>
    )
}
