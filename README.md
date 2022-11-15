![welcome](/shots/logo.png)

## Snapmemo allows users to save, share and keep track of memorable photos as digital assets on blockchain and web3.storage


## Inspiration
Whether it's the world cup, or a music concert, or some lonely time with nature, sometimes we are lucky enough to capture truly remarkable moments in photographs. Some of these photos go viral as memes as soon as they're shared on social media - but with little credit given to the true owner.

Snapmemo is inspired to let users stamp a digital ownership to their photos saved on web3.storage by creating NFTs of these photographs before sharing on social media (twitter)

Photos are saved on web3.storage when uploaded, and corresponding NFT metadata is stored in a seperate directory on web3.storage. When a digital asset (NFT) is successfully created, a tweet with links to the photo is shared automatically on twitter. 

Each users personal gallery on the web retreives metadata hashes by quering assets created by each users  unique asset name

## Revolutionalizing mobile photography, whilst leveraging NFTs and Web3.storage

[Snippet](https://youtu.be/Fj3YkRPjcqo)
[Webview]()

## User Experience

- **Authenticate web3 sand create NFT wallet using social login**

- **Upload, Mint and Tweet new NFT Pictures on one click** 

## Leveraging IPFS and WEB3.storage

- **Hosting**
A preview of website is hosted on ipfs on fleek.co

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

- **Converting web3Storage CIDv1 to 32 bytes string to fit ASA standard (Algorand asset standard)**

```
import CID from 'cids';

   function hexToBase64(hexStr) {
        let base64 = "";
        for (let i = 0; i < hexStr.length; i++) {
            base64 += !((i - 1) & 1)
                ? String.fromCharCode(parseInt(hexStr.substring(i - 1, i + 1), 16))
                : "";
        }
        return btoa(base64);

 const hex = new CID(cid).toString('base16').substring(9)

        let base64 = hexToBase64(hex);

        const buffer = Buffer.from(base64, "base64");
        const response = JSON.stringify({
            base64: base64,
            hex: hex,
            buffer: buffer.length
        });

```


## Tools
    snapmemo was boostrapped using NExtjs and Chakra UI


## Testing

- To run server locally, glone the repository. Run `npm install` and `npm run dev` 


## Links

- [IPFS Hosting](https://tiny-sea-0572.on.fleek.co/)
- [Back-end Repository](https://github.com/acgodson/snapmemo-node.git)
- [Design Journey (FIGMA)](https://www.figma.com/file/a5chpSSuMAAb6KST39mt4y/SNAPMEMO-UI?node-id=2%3A2)
- [Youtube](https://youtu.be/Fj3YkRPjcqo)

## Contributors

@cgold54
@AC_godson