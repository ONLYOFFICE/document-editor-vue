# Change Log

## [Unreleased]
- fix the editor not being reusable after unmounting the component, for example on a soft navigation
- the editor placeholder is now rendered inside a wrapper element, which is kept out of layout with display: contents
- the editor is destroyed before the component leaves the DOM, so it is torn down while it is still in the document
- fix an editor being left behind when the component is unmounted while api.js is still loading

## 1.6.1
- fix IConfig (fields pointerMode and slidePlayerBackground is not required)

## 1.6.0
- update IConfig for Document Server v9.0

## 1.5.0
- added shardkey property
- update IConfig for Document Server v8.3
- IConfig->document is not required
- fix re-rendering of component after init editors
- added props events_onRequestUsers

## 1.4.0
- improved load api.js
- bump dependencies
- updated IConfig

## 1.3.0
- extended IConfig

## 1.2.0
- added component property onLoadComponentError(), fixed issue [#7](https://github.com/ONLYOFFICE/onlyoffice-alfresco/issues/7)

## 1.1.0
- added IConfig

## 1.0.0
- Initial release
