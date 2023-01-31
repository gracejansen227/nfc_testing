import NfcManager, {NfcTech, Ndef} from 'react-native-nfc-manager';

export async function writeNdef() {
    let result = false;
  
    try {
      // STEP 1
      await NfcManager.requestTechnology(NfcTech.Ndef);
  
      const bytes = Ndef.encodeMessage([Ndef.textRecord('WASSAPPP HOEEE')]);
  
      if (bytes) {
        await NfcManager.ndefHandler // STEP 2
          .writeNdefMessage(bytes); // STEP 3
        result = true;
      }
    } catch (ex) {
      console.warn(ex);
    } finally {
      // STEP 4
      NfcManager.cancelTechnologyRequest();
    }
  
    return result;
  }