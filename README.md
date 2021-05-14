# Teachers Portal

Check out [wix-code-typescript-wrapper](https://github.com/astrauka/wix-code-typescript-wrapper) library to understand how TypeScript code connects to Wix Local Editor sources. 

## Install

Clone the project from GitHub.

Pull the editor files:

```bash
npm run wix:pull
```

Enable typescript files build and sync to Wix javascript files:

```bash
npm run build:watch
```

Open the editor:

```bash
npm run wix:editor
```

## Test

```bash
npm test
```

Cypress tests require base url environment variable specified:

```bash
CYPRESS_BASE_URL=https://www.site.com/ npm run cypress:open
```

## Deploy changes to Wix

* Pull changes `npm run wix:pull`
* Build new backend sources `npm run build`
* Open local Wix Editor `wix run wix:editor`
* All of these 3 steps can be done with `npm run wix`
* Push changes from the local Editor

## References

* [Corvid CLI](https://support.wix.com/en/article/working-with-the-corvid-cli)
* [Wix page](https://www.wix.com/dashboard/4968a067-4750-405d-ad3a-2129f3899310)
* [Keyboard shortcuts](https://support.wix.com/en/article/corvid-keyboard-shortcuts)
* [Corvid reference](https://www.wix.com/corvid/reference/)
