import React from 'react';
import {Modal, View, StyleSheet, SafeAreaView} from 'react-native';
import SignatureCapture from 'react-native-signature-canvas';

const SignatureModal = ({visible, setSign, onRequestClose}) => {
  const style = `.m-signature-pad--footer
    .button {
      background-color: #4D2C8E;
      color: #FFF;
    }`;
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      hardwareAccelerated
      statusBarTranslucent
      supportedOrientations={['landscape']}>
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <SignatureCapture
            trimWhitespace
            onOK={(img) => {
              console.log(img);
              setSign(img);
              onRequestClose();
            }}
            onEmpty={() => {
              console.log('empty');
              onRequestClose();
            }}
            descriptionText="Assinatura"
            clearText="Limpar"
            confirmText="Salvar"
            autoClear
            imageType={'image/svg+xml'}
            webStyle={style}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  safeAreaView: {
    flex: 1,
  },
});

export default SignatureModal;
