![welcome](/shots/logo.png)

## Snapmemo allows users to save, share and keep track of photographs stored on web3.storage by creating digital assets on the blockchain.


## Inspiration
Whether it's the world cup, a music concert, or some lonely time with nature, sometimes we are lucky enough to capture remarkable moments in photographs. Some of these photographs go viral as memes as soon as they're shared on social media - but with little credit given to the true owner.

Snapmemo is inspired to let users stamp digital ownership to all their photos saved on web3.storage by creating NFTs of these photographs before sharing on social media (twitter)

Photos are saved on web3.storage when uploaded, and subsequent metadata is stored in a seperate directory on web3.storage. When a digital asset (NFT) is successfully created, a tweet with link to that photo is shared automatically on twitter. 

Each users gallery can retreive all metadata collectively by quering assets created by a unique asset name on the blockchain.

## Revolutionalizing mobile photography, whilst leveraging NFTs and Web3.storage

[Snippet](https://youtu.be/Fj3YkRPjcqo)
[Webview]()

## User Experience

- **Authenticate web3 sand create NFT wallet using social login**

- **Upload, Mint and Tweet new NFT Pictures on one click** 

## Leveraging IPFS and WEB3.storage

- **Hosting**
A preview of  [website](https://tiny-sea-0572.on.fleek.co/) is hosted on ipfs on fleek.co

- **Photo Storage with Web3.storage**

```
    const client = new Web3Storage({ token });

    const files = [new File([image], `${user.id}.jpg`)];
    const cid = await client.put(files, {
      wrapWithDirectory: false,
    });

```

- **Metadata Storage with Web3.storage**

```
    const blob = new Blob([JSON.stringify(metadataObj)], {
          type: "application/json",
        });

        const metaFile = new File([blob], "metadata.json");
        const metadataCid = await client.put([metaFile], {
          wrapWithDirectory: true,
        });

```

## Tools
    snapmemo was boostrapped using NExtjs and Chakra UI

### Intergrations
 - Web3.Storage
 - Web3Auth
 - Firebase JWT
 - AlgoSDK
 - AlgoIndexer

## Testing

- To run server locally, glone the repository. Run `npm install` and `npm run dev` 


## Screens

![social-login](/shots/welcome.jpg)


![home](/shots/home.jpg)

![new-photo](/shots/newphoto.jpg)

![upload](/shots/upload.jpg)

![asset-created](/shots/success.jpg)

![gallery](/shots/gallery.jpg)

![Tweet](/shots/tweet.jpg)


## Links

- [IPFS Hosting](https://tiny-sea-0572.on.fleek.co/)
- [Back-end Repository](https://github.com/acgodson/snapmemo-node.git)
- [Design Journey (FIGMA)](https://www.figma.com/file/a5chpSSuMAAb6KST39mt4y/SNAPMEMO-UI?node-id=2%3A2)
- [Youtube](https://youtu.be/Fj3YkRPjcqo)

## Contributors

@cgold54
@AC_godson
