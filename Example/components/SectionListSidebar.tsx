import React, {
  forwardRef,
  memo,
  Mixin,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import {
  FlatList,
  PixelRatio,
  SectionList,
  SectionListProps,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
// import SectionListGetItemLayout from './SectionListGetItemLayout';
import SectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import TextIndicator from './TextIndicator';

const styles = StyleSheet.create({
  listsContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  container: {
    marginHorizontal: 8,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 3,
    marginVertical: 4,
  },
  header: {
    fontSize: 16,
    padding: 5,
    justifyContent: 'center',
    backgroundColor: '#ddd',
  },
  title: {
    fontSize: 14,
  },
  sidebarItemContainerStyle: {},
  sidebarItemTextStyle: {
    fontSize: 12,
  },
});

interface SectionListDataType {
  key: string;
  title: string;
  data: Array<any>;
}

interface SectionListSidebarProps extends SectionListProps<any, any> {
  //general
  containerStyle?: StyleProp<ViewProps>;
  //sectionList
  renderSectionHeader?: Function;
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
  renderSidebarItem?: Function;
  sidebarContainerStyle?: StyleProp<ViewProps>;
  sidebarItemStyle?: StyleProp<ViewProps>;
  sidebarItemTextStyle?: StyleProp<TextProps>;
}

const SectionListSidebar = (
  {
    sectionHeaderHeight = 20,
    itemHeight = 20,
    footerHeaderHeight = 0,
    separatorHeight = 0,
    listHeaderHeight = 0,
    renderSectionHeader = undefined,
    renderSidebarItem = undefined,
    containerStyle = styles.container,
    sectionHeaderStyle = styles.header,
    sidebarContainerStyle = styles.sidebarItemContainerStyle,
    sidebarItemTextStyle = styles.sidebarItemTextStyle,
    data,
    ...props
  }: SectionListSidebarProps,
  ref: React.LegacyRef<any>,
) => {
  const sectionKeyExtract = (item, index) => {
    return item + index;
  };

  const getItemLayout = SectionListGetItemLayout({
    getItemHeight: (rowData, sectionIndex, rowIndex) => itemHeight,
    getSectionHeaderHeight: () => sectionHeaderHeight,
    getSectionFooterHeight: () => footerHeaderHeight,
    getSeparatorHeight: () => separatorHeight / PixelRatio.get(),
    listHeaderHeight: () => listHeaderHeight,
  });

  const defaultSectionHeader = ({section}) => (
    <Text style={styles.header}>{section.title}</Text>
  );

  const jumpToSection = (sectionIndex, itemIndex = 0) => {
    console.log('jumpToSection!! : ', sectionIndex, itemIndex);
    console.log('sectionListRef!! : ', ref);
    try {
      ref.current!.scrollToLocation({
        sectionIndex,
        itemIndex,
      });
    } catch (e) {}
  };

  const defaultSidebarItem = ({item, index}) => (
    <TouchableOpacity
      onPress={() => {
        jumpToSection(index);
      }}
      style={sidebarContainerStyle}>
      <Text style={sidebarItemTextStyle}>{item}</Text>
    </TouchableOpacity>
  );

  const sidebarKeyExtractor = item => item;

  return (
    <View style={containerStyle}>
      <TextIndicator isShow={false} />
      <View style={{flexDirection: 'row'}}>
        <SectionList
          keyExtractor={sectionKeyExtract}
          getItemLayout={getItemLayout}
          renderSectionHeader={renderSectionHeader || defaultSectionHeader}
          ref={ref}
          {...props}
        />
        <View style={sidebarContainerStyle}>
          <FlatList
            data={data.map(item => item.key)}
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
