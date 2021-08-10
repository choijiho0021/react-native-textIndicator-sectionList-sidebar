/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
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
    fontSize: 20,
    height: 40,
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
  contNo: number;
}

interface TestListData {
  key: string;
  title: string;
  data: TestListItem[];
}

const App = () => {
  const [data, setData] = useState<TestListData[]>([]);
  const sidebarRef = useRef();

  const makeData: TestListData[] = (num: number) => {
    var newData: TestListData[] = [];
    for (var i = 0; i < num; i++) {
      newData.push({
        key: i.toString(),
        title: 'title',
        data: [
          {
            key: i.toString(),
            contName: i.toString(),
            contNo: i,
          },
        ],
      });
    }
    return newData;
  };

  useEffect(() => {
    console.log('setDateWork');
    const returnData = makeData(1200);
    setData(returnData);
  }, []);

  const renderItem = ({item}) => {
    console.log('renderItem : ', item);
    return (
      <View style={styles.item}>
        <Text style={styles.title}>{item.contName}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <SectionListSidebar
        sections={data}
        renderSectionHeader={({section: {title}}) => (
          <Text style={styles.header}>{title}</Text>
        )}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default App;
