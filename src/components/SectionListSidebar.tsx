import React, {forwardRef, memo, useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  ListRenderItem,
  PixelRatio,
  SectionList,
  SectionListData,
  SectionListProps,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
import SectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import TextIndicator from './TextIndicator';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 3,
    marginVertical: 4,
  },
  sectionHeaderStyle: {
    justifyContent: 'flex-end',
    textAlignVertical: 'center',
    padding: 5,
    height: 30,
    fontSize: 14,
    paddingLeft: 10,
    backgroundColor: '#ddd',
  },
  title: {
    fontSize: 14,
  },
  sidebarItemContainerStyle: {
    opacity: 0.8,
    position: 'absolute',
    bottom: 0,
    top: 20,
    right: 0,
    justifyContent: 'center',
    backgroundColor: '#ccc',
    borderRadius: 50,
    marginHorizontal: 12,
  },
  sidebarItemTextStyle: {
    flex: 1,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#222',
    justifyContent: 'center',
    textAlignVertical: 'center',
  },
  sidebarItemStyle: {
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface SectionListDataType {
  key: string;
  title: string;
  data: Array<any>;
}

interface SectionListSidebarProps extends SectionListProps<any> {
  //general
  containerStyle?: StyleProp<ViewProps>;
  rtl?: boolean;
  //sectionList
  renderSectionHeader?:
    | ((info: {section: SectionListData<any>}) => React.ReactElement | null)
    | undefined;
  data: SectionListDataType[];
  sectionHeaderTextStyle?: StyleProp<TextProps>;
  sectionHeaderStyle?: StyleProp<ViewProps>;

  //getItemList
  itemHeight?: number;
  sectionHeaderHeight?: number;
  footerHeaderHeight?: number;
  separatorHeight?: number;
  listHeaderHeight?: number;

  //sidebar
  renderSidebarItem?: ListRenderItem<string>;
  sidebarContainerStyle?: StyleProp<ViewProps>;
  sidebarItemStyle?: StyleProp<ViewProps>;
  sidebarItemTextStyle?: StyleProp<TextProps>;
  selectedText?: string;
  isSelectedShow?: boolean;
}

const SectionListSidebar = (
  {
    rtl = false,
    sectionHeaderHeight = 30,
    itemHeight = 30,
    footerHeaderHeight = 0,
    separatorHeight = 0,
    listHeaderHeight = 0,
    renderSectionHeader = undefined,
    renderSidebarItem = undefined,
    containerStyle,
    sectionHeaderStyle,
    sidebarContainerStyle,
    sidebarItemStyle,
    sidebarItemTextStyle,
    data,
    selectedText,
    isSelectedShow,
    ...props
  }: SectionListSidebarProps,
  ref: React.LegacyRef<SectionList<any>> | any,
) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [indicatorText, setIndicatorText] = useState<string>('');

  useEffect(() => {
    setIndicatorText(selectedText ?? '');
    setIsShow(isSelectedShow ?? false);
  }, [selectedText, isSelectedShow]);

  const sectionKeyExtract = (item: any, index: any) => {
    return item + index;
  };

  const getItemLayout = SectionListGetItemLayout({
    getItemHeight: (rowData, sectionIndex, rowIndex) => itemHeight,
    getSectionHeaderHeight: () => sectionHeaderHeight,
    getSectionFooterHeight: () => footerHeaderHeight,
    getSeparatorHeight: () => separatorHeight / PixelRatio.get(),
    listHeaderHeight: () => listHeaderHeight,
  });

  const defaultSectionHeader: any = ({section}: SectionListData<any>) => (
    <Text style={[styles.sectionHeaderStyle, sectionHeaderStyle]}>
      {section.title}
    </Text>
  );

  const jumpToSection = useCallback(
    (sectionIndex, itemIndex = 0) => {
      try {
        ref.current.scrollToLocation({
          sectionIndex,
          itemIndex,
        });
      } catch (e) {}
    },
    [ref],
  );

  const defaultSidebarItem = useCallback(
    ({item, index}) => {
      return (
        <View key={item} style={{paddingVertical: 10}}>
          <TouchableOpacity
            pressRetentionOffset={{bottom: 5, left: 5, right: 5, top: 5}}
            onPressIn={() => {
              jumpToSection(index);
              setIndicatorText(item);
              setIsShow(true);
            }}
            onPressOut={() => {
              setIsShow(false);
            }}
            hitSlop={{bottom: 10, left: 10, right: 10, top: 10}}
            style={[styles.sidebarItemStyle, sidebarItemStyle]}>
            <Text
              style={[
                styles.sidebarItemTextStyle,
                sidebarItemTextStyle,
                index % 2 === 1 && {fontSize: 5, fontWeight: '900'},
              ]}>
              {index % 2 ? '·' : item}
            </Text>
          </TouchableOpacity>
        </View>
      );
    },
    [jumpToSection, sidebarItemStyle, sidebarItemTextStyle],
  );

  const sidebarKeyExtractor = (item: any) => item;

  return (
    <View style={[styles.container, containerStyle]}>
      <TextIndicator isShow={isShow} text={indicatorText} />
      <View style={{flexDirection: rtl === true ? 'row-reverse' : 'row'}}>
        <SectionList
          keyExtractor={sectionKeyExtract}
          getItemLayout={getItemLayout}
          renderSectionHeader={renderSectionHeader || defaultSectionHeader}
          ref={ref}
          {...props}
        />
        <View style={[styles.sidebarItemContainerStyle, sidebarContainerStyle]}>
          <FlatList
            data={data.map(item => item.key)}
            scrollEnabled={false}
            keyExtractor={sidebarKeyExtractor}
            renderItem={renderSidebarItem || defaultSidebarItem}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </View>
  );
};

export default memo(forwardRef(SectionListSidebar));
