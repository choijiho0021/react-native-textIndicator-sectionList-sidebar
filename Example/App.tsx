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
  FlatList,
  SafeAreaView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import SectionListSidebar from './components/SectionListSidebar';

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
    fontSize: 16,
    height: 28,
  },
  title: {
    fontSize: 14,
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
  const sidebarRef = useRef();

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
    const returnData = makeData(1000);
    setData(returnData);
  }, []);

  return (
    <SafeAreaView>
      <SectionListSidebar
        itemHeight={28}
        sectionHeaderHeight={28}
        stickySectionHeadersEnabled={true}
        sections={data}
        renderSectionHeader={({section}) => {
          return <Text style={styles.header}>{section.title}</Text>;
        }}
        renderItem={({item}) => <RenderItem0 item={item} />}
      />
    </SafeAreaView>
  );
};

export default App;
