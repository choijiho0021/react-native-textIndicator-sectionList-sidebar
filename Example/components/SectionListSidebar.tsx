import React, {memo, Mixin, useCallback, useEffect, useRef} from 'react';
import {
  FlatList,
  PixelRatio,
  SectionList,
  SectionListProps,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewProps,
} from 'react-native';
// import SectionListGetItemLayout from './SectionListGetItemLayout';
import SectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import TextIndicator from './TextIndicator';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 8,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 3,
    marginVertical: 4,
  },
  header: {
    fontSize: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 14,
  },
});

interface SectionListSidebarProps extends SectionListProps<any, any> {
  itemHeight?: number;
  sectionHeaderHeight?: number;
  footerHeaderHeight?: number;
  separatorHeight?: number;
  containerStyle?: StyleProp<ViewProps>;
}

const SectionListSidebar = ({
  sectionHeaderHeight = 20,
  itemHeight = 20,
  containerStyle = styles.container,
  ...props
}: SectionListSidebarProps) => {
  const sectionKeyExtract = (item, index) => {
    return item + index;
  };

  const getItemLayout = SectionListGetItemLayout({
    getItemHeight: (rowData, sectionIndex, rowIndex) => itemHeight,
    getSectionHeaderHeight: () => sectionHeaderHeight,
    getSectionFooterHeight: () => 0,
    getSeparatorHeight: () => 0,
  });

  return (
    <View style={containerStyle}>
      <TextIndicator isShow />
      <SectionList
        keyExtractor={sectionKeyExtract}
        getItemLayout={getItemLayout}
        {...props}
      />
    </View>
  );
};

export default memo(SectionListSidebar);
