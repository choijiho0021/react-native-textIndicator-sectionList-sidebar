/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SectionListSidebar from './components/SectionListSidebar';

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 8,
  },
  item: {
    padding: 3,
    marginVertical: 4,
    height: 20,
  },
  header: {
    justifyContent: 'center',
    fontSize: 16,
    height: 28,
  },
  title: {
    fontSize: 14,
  },

  sidebarBtn: {
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarContainer: {
    flex: 1,
    opacity: 0.8,
    position: 'absolute',
    bottom: 0,
    top: 20,
    right: 0,
    justifyContent: 'center',
    height: (windowHeight * 2) / 3,
  },
  sidebarText: {
    flex: 1,
    fontSize: 10,
    color: '#222',
    justifyContent: 'center',
    textAlignVertical: 'center',
  },
});

interface TestData {
  title: string;
  data: Array<string>;
}
export interface TestListItem {
  key?: string;
  contName: string;
}

interface TestListData {
  key: string;
  title: string;
  data: TestListItem[];
}

interface SimpleData {
  key: string;
  title: string;
  data: {content: string}[];
}

const RenderItem = ({item}) => {
  console.log('renderItem : ', item);
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{item.content}</Text>
    </View>
  );
};

const RenderItem0 = memo(RenderItem);

const App = () => {
  const [data, setData] = useState<SimpleData[]>([]);
  const sidebarRef = useRef<any>();
  const [isShow, setIsShow] = useState<boolean>(false);
  const [indicatorText, setIndicatorText] = useState<string>('');

  const makeData: SimpleData[] = (num: number) => {
    var newData: SimpleData[] = [];
    for (var i = 0; i < num; i++) {
      newData.push({
        key: i.toString(),
        title: 'title',
        data: [{content: 'One' + 1}, {content: 'Two' + 2}],
      });
    }
    return newData;
  };

  useEffect(() => {
    console.log('setDateWork');
    const returnData = makeData(202);
    setData(returnData);
  }, []);

  const jumpToSection = (sectionIndex, itemIndex = 0) => {
    // console.log('jumpToSection!! : ', sectionIndex, itemIndex);
    // console.log('sectionListRef!! : ', sidebarRef);
    try {
      sidebarRef.current!.scrollToLocation({
        sectionIndex,
        itemIndex,
      });
    } catch (e) {}
  };

  const renderSidebarItem = useCallback(({item, index}) => {
    return (
      <View key={item} style={{paddingVertical: 10}}>
        <Pressable
          onPressIn={() => {
            jumpToSection(index);
            setIndicatorText(index);
            setIsShow(true);
          }}
          onPressOut={() => {
            setIsShow(false);
          }}
          style={[styles.sidebarBtn]}>
          <Text
            style={[
              styles.sidebarText,
              index % 2 === 1 && {fontSize: 5, fontWeight: '900'},
            ]}>
            {index % 2 ? '·' : item}
          </Text>
        </Pressable>
      </View>
    );
  }, []);

  return (
    <SafeAreaView>
      <SectionListSidebar
        ref={sidebarRef}
        itemHeight={28}
        sectionHeaderHeight={29.7}
        stickySectionHeadersEnabled={true}
        sections={data}
        data={data}
        // renderSectionHeader={({section}) => {
        //   return <Text style={styles.header}>{section.title}</Text>;
        // }}
        selectedText={indicatorText}
        isSelectedShow={isShow}
        renderSidebarItem={renderSidebarItem}
        renderItem={({item}) => <RenderItem0 item={item} />}
      />
    </SafeAreaView>
  );
};

export default App;
