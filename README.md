# Warn - Work Progress!

# react-native-textindicator-sectionlist-sidebar
![Aug-24-2021 17-58-14](https://user-images.githubusercontent.com/85142573/130588405-2cd3970b-f5ac-47ac-a405-aac1f3acdc7e.gif)

react-navtive-textIndicator-sectionList-sidebar is a simple sectionList With sidebar and textIndicator for iOS and Android.

you can scroll to touch sidebar index. it supports react version >= 0.60 and <= 0.59.

## Document

- [Installation](#installation)
- [How to use](#how-to-use)
- [Properties](#properties)
- [Demo](#demo)
- [Example code](#example-code)

## Installation

execute the command to install react-native-textIndicator-sectionList-sidebar
```bash
npm install react-native-textIndicator-sectionList-sidebar
```

## How to use
Import react-native-textindicator-sectionlist-sidebar

```js
import SectionListSidebar from 'react-native-textindicator-sectionlist-sidebar';
```

Add the source code below to where you want to use it.
```js
return (
      <SectionListSidebar
        ref={sectionListRef}
        data={sections}
        renderItem={renderContactList}
        itemHeight={30}
        sectionHeaderHeight={20}
        sectionHeaderStyle={styles.sectionHeader}
        locale="en"
      />
);
```


## Properties

You can use All props of React Native Image for the original image(not full size modal image).
Below are react-native-image-modal specific properties.

| Prop                           | required | Type                                                                                                                  | Description                                                                                                                                |
| ------------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| rtl | X  | boolean| it is for sidebar position. Default is `false`. If you don't want Sidebar to be on the right side of the sectionlist, set `true`. |
| locale | X  | "kor" \| "en" | it is for sidebar item locale. Default is `en`. if you want place alphabet to sidebar item. set `en` or default | 
| sectionHeaderHeight | X  | number | set the height of sectionlist. it is work for getItemLayout. if you put wrong height. it will Hundreds of items cause bugs such as slowing down and shaking the screen when scrolling. If you want to know more, see [this post](https://medium.com/@jsoendermann/sectionlist-and-getitemlayout-2293b0b916fb). default is `30` which is the same height as defaultSectionHeader.  | 
| itemHeight | X  | number | Section's item height. Default is `30`. | 
| footerHeaderHeight | X  | number | Section's footer HeaderHeight. Default is `0`.| 
| separatorHeight | X  | number | Section's list item separatorHeight. Default is `0`.| 
| listHeaderHeight | X  | number |SectionList top header height. Default is `0`.| 
| renderSectionHeader | X  | object | Returns section header component.| 
| data | O  | object {key:string;title:string; data :Array<any>}| Sections data.| 
| sectionHeaderStyle | X  | object | Section's header style. | 
| renderSidebarItem | X  | object |Returns sidebar's item component. | 
| sidebarContainerStyle | X  | object |sidebar container style.| 
| sidebarItemStyle | X  | object |sidebar's item style. | 
| sidebarItemTextStyle | X  | object |sidebar's item text style. | 
| selectedText | X  | object | it is print text when scrolling. if you want use custom renderSidebar with text indicator. you need put text. i will make some example. | 
| isSelectedShow | X  | object | if it false. print text not show when scrolling. | 
| ref | O  | object |sectionlist's ref. for working sidebar's scrollToIndex. if you not set ref. then not working scrollToIndex.| 
