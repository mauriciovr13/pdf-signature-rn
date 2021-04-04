import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import Pdf from 'react-native-pdf';
import * as RNFS from 'react-native-fs';
import {PDFDocument, PDFPage} from 'pdf-lib';

import SignatureModal from './SignatureModal';

const PdfSignature = () => {
  const sourceUrl = 'http://samples.leanpub.com/thereactnativebook-sample.pdf';
  const filePath = `${RNFS.DocumentDirectoryPath}/react-native.pdf`;
  const [fileDownloaded, setFileDownloaded] = useState(false);
  const [signature, setSign] = useState(null);
  const [pdfBase64, setPdfBase64] = useState(null);
  const [visible, setVisible] = useState(false);
  const [newPath, setNewPath] = useState(filePath);

  const readFile = () => {
    RNFS.readFile(filePath, 'base64').then((contents) => {
      setPdfBase64(contents);
    });
  };

  const downloadFile = () => {
    console.log('___downloadFile -> Start', filePath);
    RNFS.downloadFile({
      fromUrl: sourceUrl,
      toFile: filePath,
    }).promise.then((res) => {
      console.log('___downloadFile -> File downloaded', res);
      setFileDownloaded(true);
      readFile();
    });
  };

  const colocarAssinatura = async (pageTaped, x, y) => {
    const pdfDoc = await PDFDocument.load(pdfBase64);
    const pngImage = await pdfDoc.embedPng(signature);
    const pages = pdfDoc.getPages();
    const page = pages[pageTaped - 1];
    const {width, height} = page.getSize();
    console.log(width, height);
    page.drawImage(pngImage, {
      x: 0,
      y: 0,
      width: 200,
      height: 80,
    });
    const pdfDataURI = await pdfDoc.saveAsBase64({dataUri: true});
    setNewPath(pdfDataURI);
    RNFS.writeFile(filePath, pdfDataURI, 'base64')
      .then((success) => {
        console.log('sucesso', success);
      })
      .catch((err) => {
        console.log('error', err.message);
      });
  };

  useEffect(() => {
    downloadFile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <View style={styles.container}>
        {fileDownloaded && (
          <Pdf
            enablePaging
            minScale={1.0}
            maxScale={1.0}
            scale={1.0}
            spacing={0}
            fitPolicy={2}
            source={{uri: newPath}}
            onLoadComplete={(numberOfPages) => {
              console.log(`number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page, numberOfPages) => {
              console.log(`current page: ${page}-${numberOfPages}`);
            }}
            onError={(error) => {
              console.log(error);
            }}
            onPageSingleTap={(page, x, y) => {
              console.log(`tap: ${page}`);
              console.log(`x: ${x}`);
              console.log(`y: ${y}`);
              if (signature) {
                colocarAssinatura(page, x, y);
              }
            }}
            style={styles.pdf}
          />
        )}
        {signature && (
          <View style={styles.preview}>
            <Image
              resizeMode={'contain'}
              style={{width: 335, height: 114}}
              source={{uri: signature}}
            />
          </View>
        )}
        <TouchableOpacity
          onPress={() => setVisible(true)}
          style={styles.button}>
          <Text style={styles.text}>
            {!signature ? 'Criar assinatura' : 'Gerar novamente'}
          </Text>
        </TouchableOpacity>
      </View>
      <SignatureModal
        visible={visible}
        setSign={setSign}
        onRequestClose={() => setVisible(false)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdf: {
    width: '100%',
    borderRadius: 8,
    flex: 1,
  },
  preview: {
    width: 335,
    height: 114,
    backgroundColor: '#EFEDF3',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
    borderRadius: 15,
  },
  button: {
    backgroundColor: '#4D2C8E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 10,
  },
  text: {
    color: '#fff',
  },
});

export default PdfSignature;
