import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  FlatList,
  GestureResponderEvent,
  ListRenderItem,
  PanResponder,
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

const windowHeight = Dimensions.get('window').height;

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
    top: 30,
    right: 0,
    justifyContent: 'center',
    //backgroundColor: '#ccc',
    backgroundColor: 'red',
    borderRadius: 50,
    marginHorizontal: 12,
  },
  sidebarItemTextStyle: {
    fontSize: 12,
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

interface SectionListSidebarProps extends SectionListProps<any, any> {
  //general
  containerStyle?: StyleProp<ViewProps>;
  rtl?: boolean;
  //sectionList
  renderSectionHeader?:
    | ((info: {
        section: SectionListData<any, any>;
      }) => React.ReactElement | null)
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
  ref: React.LegacyRef<SectionList>,
) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [indicatorText, setIndicatorText] = useState<string>('');
  const pageX = useRef<number>();
  const pageY = useRef<number>();

  useEffect(() => {
    setIndicatorText(selectedText ?? '');
    setIsShow(isSelectedShow ?? false);
  }, [selectedText, isSelectedShow]);

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

  const defaultSectionHeader = ({section}: SectionListData<any, any>) => (
    <Text style={[styles.sectionHeaderStyle, sectionHeaderStyle]}>
      {section.title}
    </Text>
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponder: (
          event: GestureResponderEvent,
          {dx, dy, x0, y0, vx, vy, moveX, moveY},
        ) => {
          console.log(event.nativeEvent.touches);
          console.log('panResponder x, y : ', moveX, ',', moveY);
          pageX.current = moveX;
          pageY.current = moveY;
          return false;
        },
      }),
    [],
  );

  const jumpToSection = useCallback(
    (sectionIndex, itemIndex = 0) => {
      try {
        ref!.current.scrollToLocation({
          sectionIndex,
          itemIndex,
        });
      } catch (e) {}
    },
    [ref],
  );

  const settingFirstLetter = (maxNum: number, item: any[]) => {
    var result = item;
    console.log('settingFirstLetterArray : ', item);
    console.log('current item length : ', item.length);
    var value = maxNum - item.length;
    console.log('value : ', value);
    if (maxNum > item.length) {
      return item;
    }

    for (var i = 0; i < value; i++) {}

    return result;
  };

  const defaultSidebarItem = useCallback(
    ({item, index}) => {
      return (
        <View key={item} style={{paddingVertical: 5}}>
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
            <Text style={[styles.sidebarItemTextStyle, sidebarItemTextStyle]}>
              {item}
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
        <View
          style={[styles.sidebarItemContainerStyle, sidebarContainerStyle]}
          {...panResponder.panHandlers}>
          {settingFirstLetter(
            25,
            data.map(item => item.key),
          ).map((item, index) => defaultSidebarItem({item, index}))}
        </View>
      </View>
    </View>
  );
};

export default memo(forwardRef(SectionListSidebar));
