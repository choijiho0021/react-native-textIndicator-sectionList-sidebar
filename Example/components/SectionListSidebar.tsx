import React, {memo, useCallback, useEffect, useRef} from 'react';
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
  containerStyle?: StyleProp<ViewProps>;
}

const SectionListSidebar = ({
  containerStyle = styles.container,
  ...props
}: SectionListSidebarProps) => {
  const sectionKeyExtract = item => {
    return item;
  };

  return (
    <View style={containerStyle}>
      <SectionList keyExtractor={sectionKeyExtract} {...props} />
    </View>
  );
};

export default memo(SectionListSidebar);
