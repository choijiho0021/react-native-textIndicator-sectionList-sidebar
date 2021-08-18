import React, {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
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
} from "react-native";
import SectionListGetItemLayout from "react-native-section-list-get-item-layout";
import TextIndicator from "./TextIndicator";

const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 3,
    marginVertical: 4,
  },
  sectionHeaderStyle: {
    justifyContent: "flex-end",
    textAlignVertical: "center",
    padding: 5,
    height: 30,
    fontSize: 14,
    paddingLeft: 10,
    backgroundColor: "#e5e5e5",
  },
  title: {
    fontSize: 14,
  },
  sidebarItemContainerStyle: {
    opacity: 0.7,
    position: "absolute",
    top: 30,
    right: 0,
    justifyContent: "center",
    backgroundColor: "#e5e5e5",
    borderRadius: 50,
    marginHorizontal: 12,
  },
  sidebarItemTextStyle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#222",
    justifyContent: "center",
    textAlignVertical: "center",
  },
  sidebarItemStyle: {
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
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
  ref: React.LegacyRef<SectionList>
) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [indicatorText, setIndicatorText] = useState<string>("");
  const [sidebarItemHeight, setSidebarItemHeight] = useState<number>(25);
  const sidebarRef = useRef<View>();

  const settingFirstLetter = (maxNum: number = 25, item: any[]) => {
    var result = item;
    var contraction = item.length - maxNum;

    for (var i = 0; 0 < contraction && i < item.length; i++) {
      if ((i + 1) % 2 === 0) {
        if (contraction > 0) {
          contraction--;
          result.splice(i, 2, "·");
        }
      }
    }

    return result;
  };

  useEffect(() => {
    setIndicatorText(selectedText ?? "");
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

  const defaultSectionHeader = ({ section }: SectionListData<any, any>) => (
    <Text style={[styles.sectionHeaderStyle, sectionHeaderStyle]}>
      {section.title}
    </Text>
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onStartShouldSetPanResponderCapture: () => false,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderGrant: () => {
          setIsShow(true);
        },
        onPanResponderMove: (
          event,
          { dx, dy, x0, y0, vx, vy, moveX, moveY }
        ) => {
          sidebarRef.current?.measure((fx, fy, width, height, px, py) => {
            var index = (index = Math.floor((moveY - py) / sidebarItemHeight));

            if (0 <= index && index < data.length) {
              setIndicatorText(data[index].key);
              jumpToSection(index, 0);
            }
            try {
            } catch (e) {
              console.log("move Error : ", e);
            }
          });
          return false;
        },
        onPanResponderEnd: () => {
          setIsShow(false);
        },
      }),
    []
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
    [ref]
  );

  const defaultSidebarItem = useCallback(
    ({ item, index }) => {
      return (
        <View key={data[index].key} style={{ paddingVertical: 5 }}>
          <TouchableOpacity
            pressRetentionOffset={{ bottom: 5, left: 5, right: 5, top: 5 }}
            hitSlop={{ bottom: 10, left: 10, right: 10, top: 10 }}
            style={[styles.sidebarItemStyle, sidebarItemStyle]}
          >
            <Text style={[styles.sidebarItemTextStyle, sidebarItemTextStyle]}>
              {item}
            </Text>
          </TouchableOpacity>
        </View>
      );
    },
    [jumpToSection, sidebarItemStyle, sidebarItemTextStyle]
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <TextIndicator isShow={isShow} text={indicatorText} />
      <View style={{ flexDirection: rtl === true ? "row-reverse" : "row" }}>
        <SectionList
          keyExtractor={sectionKeyExtract}
          getItemLayout={getItemLayout}
          renderSectionHeader={renderSectionHeader || defaultSectionHeader}
          ref={ref}
          {...props}
        />
        <Animated.View
          ref={sidebarRef}
          style={[styles.sidebarItemContainerStyle, sidebarContainerStyle]}
          {...panResponder.panHandlers}
        >
          {settingFirstLetter(
            25,
            data.map((item) => item.key)
          ).map((item, index) => defaultSidebarItem({ item, index }))}
        </Animated.View>
      </View>
    </View>
  );
};

export default memo(forwardRef(SectionListSidebar));
