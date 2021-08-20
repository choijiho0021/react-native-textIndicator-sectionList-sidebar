import React, {
  forwardRef,
  memo,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Dimensions,
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
    backgroundColor: '#e5e5e5',
  },
  title: {
    fontSize: 14,
  },
  sidebarItemContainerStyle: {
    opacity: 0.7,
    position: 'absolute',
    top: 0,
    right: 0,
    justifyContent: 'center',
    backgroundColor: '#e5e5e5',
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

const windowHeight = Dimensions.get('window').height;

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
  maxSidebarText?: number;
  sidebarItemHeight?: number;
}

interface DataType {
  key: string;
  title: string;
  data: any[];
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
    selectedText = '',
    isSelectedShow,
    maxSidebarText = 20,
    sidebarItemHeight = 23,
    ...props
  }: SectionListSidebarProps,
  ref: React.LegacyRef<SectionList>,
) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [indicatorText, setIndicatorText] = useState<string>('');
  const sidebarRef = useRef<View>();
  const contraction = useRef<number>(
    data.length - maxSidebarText < 0 ? 0 : data.length - maxSidebarText,
  );
  const input = useRef<any[]>(['ㄴ', 'ㄷ', 'ㅁ', 'A', 'B']);
  const output = useRef<any[]>([
    0, 0, 1, 1, 2, 2, 2, 2, 2, 2, 3, 4, 5, 6, 7, 11, 12, 12,
  ]);

  const isNumber = elm => {
    return !isNaN(elm);
  };

  const [defaultSidebarData, setDefaultSidebarData] = useState<any[]>([
    {key: 'ㄱ'},
    {key: 'ㄴ'},
    {key: 'ㄷ'},
    {key: 'ㄹ'},
    {key: 'ㅁ'},
    {key: 'ㅂ'},
    {key: 'ㅅ'},
    {key: 'ㅇ'},
    {key: 'ㅈ'},
    {key: 'ㅊ'},
    {key: 'ㅋ'},
    {key: 'ㅌ'},
    {key: 'ㅍ'},
    {key: 'ㅎ'},
    {key: 'A'},
    {key: 'F'},
    {key: 'O'},
    {key: 'Z'},
    {key: '#'},
  ]);

  const settingFirstLetter = (item: any[]) => {
    var result = item;

    return result;
  };

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

  const setTargetIndexList = (input: string[]) => {
    const targetIndexList = defaultSidebarData
      .map(item => input.indexOf(item.key))
      .map((item, index, array) => {
        if (item === -1) {
          for (var i = index; i <= array.length; i++) {
            if (array[i] === undefined) continue;
            if (array[i] !== -1) {
              return array[i];
            }
          }
          return input.length;
        }
        return item;
      });

    return targetIndexList;
  };

  const panResponder = useMemo(() => {
    var index = 0;
    const targetList = setTargetIndexList(data.map(item => item.key));
    return PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setIsShow(true);
      },
      onPanResponderMove: (event, {dx, dy, x0, y0, vx, vy, moveX, moveY}) => {
        sidebarRef.current?.measure((fx, fy, width, height, px, py) => {
          index = Math.floor((moveY - py) / sidebarItemHeight);

          if (0 <= index && index < defaultSidebarData.length) {
            setIndicatorText(defaultSidebarData[index].key);
            jumpToSection(targetList[index], 0);
          }
          try {
          } catch (e) {
            console.log('move Error : ', e);
          }
        });
        return false;
      },
      onPanResponderEnd: () => {
        setIsShow(false);
      },
    });
  }, []);

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

  const defaultSidebarItem = useCallback(
    ({item, index}) => {
      return (
        <View key={item} style={{paddingVertical: 5}}>
          <TouchableOpacity
            pressRetentionOffset={{bottom: 5, left: 5, right: 5, top: 5}}
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

  return (
    <View style={[styles.container, containerStyle]}>
      <TextIndicator isShow={isShow} text={indicatorText} />
      <View style={{flexDirection: rtl === true ? 'row-reverse' : 'row'}}>
        <SectionList
          keyExtractor={sectionKeyExtract}
          getItemLayout={getItemLayout}
          renderSectionHeader={renderSectionHeader || defaultSectionHeader}
          ref={ref}
          sections={data}
          {...props}
        />
        <Animated.View
          ref={sidebarRef}
          style={[
            styles.sidebarItemContainerStyle,
            {maxHeight: windowHeight},
            sidebarContainerStyle,
          ]}
          {...panResponder.panHandlers}>
          {defaultSidebarData
            .map(item => item.key)
            .map((item, index) =>
              renderSidebarItem === undefined
                ? defaultSidebarItem({item, index})
                : renderSidebarItem({item, index}),
            )}
        </Animated.View>
      </View>
    </View>
  );
};

export default memo(forwardRef(SectionListSidebar));
