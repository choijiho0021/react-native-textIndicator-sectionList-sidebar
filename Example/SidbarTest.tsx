import React from 'react';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';

interface ExampleItem {
  title: string;
  isBig: boolean;
}

const getItemLayout = sectionListGetItemLayout<ExampleItem>({
  getItemHeight: (rowData, sectionIndex, rowIndex) =>
    rowData.isBig ? 120 : 80,
  // additional optional config params: see above
});

const MyComponent: React.FC = () => {
  return (
    <SectionList<ExampleItem> {...otherStuff} getItemLayout={getItemLayout} />
  );
};
