import { SafeEventEmitterProvider } from "@web3auth/base";
import algosdk, { waitForConfirmation } from "algosdk";
import { ALGO_API_KEY } from "../config";
const algodToken = {
  "x-api-key": ALGO_API_KEY,
};
const algodServer = "https://testnet-algorand.api.purestake.io/idx2";
const algodPort = "";

const indexerClient = new algosdk.Indexer(algodToken, algodServer, algodPort);

export default class AlgorandRPC {
  private provider: SafeEventEmitterProvider;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
  }

  getAlgorandKeyPair = async (): Promise<any> => {
    const privateKey = (await this.provider.request({
      method: "private_key",
    })) as string;
    var passphrase = algosdk.secretKeyToMnemonic(
      Buffer.from(privateKey, "hex")
    );
    var keyPair = algosdk.mnemonicToSecretKey(passphrase);
    return keyPair;
  };

  getAccounts = async (): Promise<any> => {
    const keyPair = await this.getAlgorandKeyPair();
    return keyPair.addr;
  };

  getBalance = async (): Promise<any> => {
    const keyPair = await this.getAlgorandKeyPair();
    const client = await this.makeClient();
    const balance = await client.accountInformation(keyPair.addr).do();
    return balance.amount;
  };

  makeClient = async (): Promise<any> => {
    const algodToken = {
      "x-api-key": ALGO_API_KEY,
    };
    const algodServer = "https://testnet-algorand.api.purestake.io/ps2";
    const algodPort = "";
    let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
    const client = algodClient;
    return client;
  };

  signMessage = async (): Promise<any> => {
    const keyPair = await this.getAlgorandKeyPair();
    const client = await this.makeClient();
    const params = await client.getTransactionParams().do();
    const enc = new TextEncoder();
    const message = enc.encode("Web3Auth says hello!");
    const txn = algosdk.makePaymentTxnWithSuggestedParams(
      keyPair.addr,
      keyPair.addr,
      0,
      undefined,
      message,
      params
    );
    let signedTxn = algosdk.signTransaction(txn, keyPair.sk);
    let txId = signedTxn.txID;
    return txId;
  };

  signAndSendTransaction = async (
    receiver: string,
    note: string,
    amount: number
  ): Promise<any> => {
    try {
      const keyPair = await this.getAlgorandKeyPair();
      const client = await this.makeClient();
      const params = await client.getTransactionParams().do();
      const enc = new TextEncoder();
      const message = enc.encode(note);
      const txn = algosdk.makePaymentTxnWithSuggestedParams(
        keyPair.addr, // sender
        receiver, // receiver
        amount,
        undefined,
        message,
        params
      );

      let signedTxn = algosdk.signTransaction(txn, keyPair.sk);
      const txHash = await client.sendRawTransaction(signedTxn.blob).do();
      console.log(txHash);
      return txHash.txId;
    } catch (error) {
      console.log(error);
    }
  };

  printCreatedAsset = async (
    account: string,
    assetid: number
  ): Promise<any> => {
    const client = await this.makeClient();
    let i: number;
    let accountInfo = await client.accountInformation(account).do();

    for (i = 0; i < accountInfo["created-assets"].length; i++) {
      let scrutinizedAsset = accountInfo["created-assets"][i];
      if (scrutinizedAsset["index"] == assetid) {
        console.log("AssetID = " + scrutinizedAsset["index"]);
        let myparms = JSON.stringify(scrutinizedAsset["params"], undefined, 2);
        console.log("parms = " + myparms);
        return myparms;
      }
    }
  };

  printAssetHolding = async (
    account: string,
    assetid: number
  ): Promise<any> => {
    const client = await this.makeClient();
    let i: number;

    const parami = [];
    let accountInfo = await client.accountInformation(account).do();
    for (i = 0; i < accountInfo["assets"].length; i++) {
      let scrutinizedAsset = accountInfo["assets"][i];
      if (scrutinizedAsset["asset-id"] == assetid) {
        let myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
        console.log("assetholdinginfo = " + myassetholding);
        parami.push(myassetholding);
        return parami;
      }
    }
  };

  ///Create a Digital Asset on Alogrand Blockchain
  createAsset = async (cid: string): Promise<any> => {
    const keyPair = await this.getAlgorandKeyPair();
    const client = await this.makeClient();
    const params = await client.getTransactionParams().do();

    var enc = new TextEncoder();
    const unitName = "SNAP";
    const assetName = "snap@arc3";
    let assetURL = `ipfs://${cid}/metadata.json`;
    let totalIssuance = 1;

    let note = enc.encode(cid);
    let addr = keyPair.addr;
    let defaultFrozen = false;
    let decimals = 0;
    let assetMetadataHash = "";
    let manager = keyPair.addr;
    let reserve = keyPair.addr;
    let freeze = keyPair.addr;
    let clawback = keyPair.addr;

    // signing and sending "txn" allows "addr" to create an asset
    let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
      addr,
      note,
      totalIssuance,
      decimals,
      defaultFrozen,
      manager,
      reserve,
      freeze,
      clawback,
      unitName,
      assetName,
      assetURL,
      assetMetadataHash,
      params
    );

    const rawSignedTxn = txn.signTxn(keyPair.sk);
    let ctx = await client.sendRawTransaction(rawSignedTxn).do();

    // Wait for confirmation
    let confirmedTxn = await algosdk.waitForConfirmation(client, ctx.txId, 4);
    //Get the completed Transaction
    console.log(
      "Transaction " +
        ctx.txId +
        " confirmed in round " +
        confirmedTxn["confirmed-round"]
    );

    const assetID = confirmedTxn["asset-index"];

    const result = await this.printCreatedAsset(keyPair.addr, assetID);
    return result;
  };

  /// Look up all Assets Held by an Account
  findAssetsOnAccount = async (address: string): Promise<any> => {
    let response = await indexerClient.lookupAccountAssets(address).do();
    console.log(JSON.stringify(response, undefined, 2));
  };

  lookUpAssetName = async (): Promise<any> => {
    let name = "snap@arc3";
    // console.log(
    //   "Information for Asset Name: " + JSON.stringify(assetInfo, undefined, 2)
    // );
    let assetInfo = await indexerClient.searchForAssets().name(name).do();
    
    return assetInfo;
  };
}
