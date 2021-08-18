import React, { forwardRef, memo } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

const styles = StyleSheet.create({
  center: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  box: {
    width: 60,
    height: 60,
    opacity: 0.6,
    borderRadius: 10,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    fontSize: 32,
  },
});

interface TextIndicatorProps {
  isShow: boolean;
  style?: StyleProp<ViewStyle>;
  text?: string;
}

const TextIndicator = ({ isShow, style, text }: TextIndicatorProps) => {
  return isShow ? (
    <View style={[styles.center, style, { zIndex: 9999 }]} collapsable={false}>
      <View style={styles.box}>
        {isShow && <Text style={styles.content}>{text}</Text>}
      </View>
    </View>
  ) : null;
};

export default memo(TextIndicator);
