import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Linking} from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';
import NfcManager, {NfcTech, Ndef, TagEvent} from 'react-native-nfc-manager';
import { writeNdef } from './writeNdef'

// Pre-step, call this before any NFC operations
NfcManager.start();

function App() {

  async function parseUri(tag: TagEvent | null){
    try {
      if (tag){
        return Ndef.uri.decodePayload(tag.ndefMessage[0].payload[0]);
      }

  } catch (e) {
      console.log(e);
  }
  return null;
  }

  async function readNdef() {
    try {
      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.MifareIOS);
      // await NfcManager.registerTagEvent();
      // the resolved tag object will contain `ndefMessage` property
      //   let ndef = await NfcManager.ndefHandler.getNdefMessage();
      const tag = await NfcManager.getTag();
      console.warn('Tag found', tag);
      let url = await parseUri(tag);
      if (url){
        console.log("do we get here")
        Linking.openURL(url).catch((error: any) => console.warn(error))
      }
      let toast = Toast.show(`this is the tag${tag}`, {
        duration: Toast.durations.LONG,
      });
      // await NfcManager.registerTagEvent();
    } catch (ex) {
      console.warn('Oops!', ex);
      Toast.show(`this is the error: ${ex}`, {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP
      });
      NfcManager.cancelTechnologyRequest();
    } finally {
      // stop the nfc scanning
      NfcManager.cancelTechnologyRequest();
      NfcManager.unregisterTagEvent();
    }
  }

  async function clearTag(){
    await NfcManager.clearBackgroundTag()
  }

  return (
    <RootSiblingParent>
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={readNdef} style={{padding: 10, backgroundColor:"pink", borderRadius: 5, marginBottom: 10}}>
        <Text>Scan a Tag</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={writeNdef} style={{padding: 10, backgroundColor:"cyan", borderRadius: 5, marginBottom: 10}}>
        <Text>Write NDEF</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={clearTag} style={{padding: 10, backgroundColor:"yellow", borderRadius: 5}}>
        <Text>Clear Tag</Text>
      </TouchableOpacity>
    </View>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white"
  },
});

export default App;