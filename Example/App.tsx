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
    height: 30,
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
  data: string[];
}

const RenderItem = ({item}) => {
  return (
    <View style={styles.item}>
      <Text style={styles.title}>{item}</Text>
    </View>
  );
};

const RenderItem0 = memo(RenderItem);

const App = () => {
  const [data, setData] = useState<SimpleData[]>([
    {
      key: 'ㄴ',
      title: 'start ㄴ',
      data: ['Amy', 'Ari', 'Abundon', 'Ari', 'Abundon', 'Ari', 'Abundon'],
    },
    {
      key: 'ㄹ',
      title: 'start ㄹ',
      data: ['Amy', 'Ari', 'Abundon', 'Ari', 'Abundon', 'Ari', 'Abundon'],
    },
    {key: 'ㅊ', title: 'start ㅊ', data: ['Iri', 'Iyo', 'Illidan']},
    {key: 'ㅋ', title: 'start ㅋ', data: ['John', 'Jean', 'Jorky']},
    {key: 'ㅌ', title: 'start ㅌ', data: ['Kavin', 'Katlin', 'Kasadin']},
    {key: 'ㅍ', title: 'start ㅍ', data: ['Lulu', 'Lock', 'Liva']},
    {key: 'ㅎ', title: 'start ㅎ', data: ['Mali', 'Madive', 'Momo']},
    {key: 'A', title: 'start A', data: ['Amy', 'Ari', 'Abundon']},
    {key: 'B', title: 'start B', data: ['Amy', 'Ari', 'Abundon']},
    {key: 'C', title: 'start C', data: ['Amy', 'Ari', 'Abundon']},
    {key: 'D', title: 'start D', data: ['Amy', 'Ari', 'Abundon']},
    {key: 'F', title: 'start F', data: ['Fat', 'Father', 'Foo']},
    {key: 'O', title: 'start O', data: ['Ori', 'Orstern', 'Ork']},
    {key: 'P', title: 'start P', data: ['Amy', 'Ari', 'Abundon']},
    {key: 'Q', title: 'start Q', data: ['Amy', 'Ari', 'Abundon']},
  ]);
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

  const jumpToSection = (sectionIndex, itemIndex = 0) => {
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
            setIndicatorText(item);
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
    <SafeAreaView style={{flex: 1}}>
      <SectionListSidebar
        ref={sidebarRef}
        itemHeight={30}
        sectionHeaderHeight={30}
        stickySectionHeadersEnabled={true}
        sections={data}
        data={data}
        selectedText={indicatorText}
        isSelectedShow={isShow}
        renderItem={({item}) => <RenderItem0 item={item} />}
        locale={'kor'}
      />
    </SafeAreaView>
  );
};

export default App;
