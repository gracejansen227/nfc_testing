import NfcManager, {NfcTech, Ndef, nfcManager} from 'react-native-nfc-manager';
import Toast from 'react-native-root-toast';

function buildUrlpayload(value: string){
    return Ndef.encodeMessage([
        Ndef.uriRecord(value)
    ])
}


export async function writeNdef() {
    let result = false;
  
    try {
      // STEP 1
      let resp = await NfcManager.requestTechnology(NfcTech.Ndef, {
        alertMessage: 'Ready to write some shit bruh'
      });
      let bytes = buildUrlpayload('https://www.linkedin.com/in/gracejansen/');
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      await NfcManager.setAlertMessageIOS("I got your tag!")
    } catch (ex) {
      console.warn(ex);
            NfcManager.cancelTechnologyRequest().catch(() => 0);
    } finally {
      // STEP 4
      NfcManager.cancelTechnologyRequest().catch(() => 0);
    }
  
    return result;
  }