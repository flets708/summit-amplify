import React from 'react';
import Amplify from 'aws-amplify'
import { withAuthenticator } from '@aws-amplify/ui-react'
import awsconfig from './aws-exports'
import './App.css'
import { MuiThemeProvider } from '@material-ui/core/styles'
import ServerlessAlbumContainer from './serverlessAlbumContainer';
import theme from './theme';
Amplify.configure(awsconfig)

const App: React.FC = () => {

  return (
    <>
      <MuiThemeProvider theme={theme}>
        <ServerlessAlbumContainer />
      </MuiThemeProvider>
    </>
  );
}

export default withAuthenticator(App);
