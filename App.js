import React from 'react';
import {SafeAreaView, StatusBar} from 'react-native';
import PdfSignature from './src/PdfSignature';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>
        <PdfSignature />
      </SafeAreaView>
    </>
  );
};

export default App;
