import React, {memo} from 'react';
import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

interface TextIndicatorProps {
  isShow: boolean;
  style?: StyleProp<ViewStyle>;
}

const TextIndicator = ({isShow, style}: TextIndicatorProps) => {
  return isShow ? (
    <View style={[styles.center, style, {zIndex: 9999}]} collapsable={false}>
      {/* 글자 출력 부분 isShow && <Text> </Text> */}
    </View>
  ) : null;
};

export default memo(TextIndicator);
