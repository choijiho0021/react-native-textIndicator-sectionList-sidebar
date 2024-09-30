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
	Easing,
	ListRenderItem,
	PanResponder,
	PixelRatio,
	SectionList,
	SectionListData,
	SectionListProps,
	StyleProp,
	StyleSheet,
	Text,
	TextStyle,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import SectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import TextIndicator from './TextIndicator';

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	sectionHeaderStyle: {
		justifyContent: 'flex-end',
		textAlignVertical: 'center',
		padding: 5,
		height: 30,
		fontSize: 14,
		paddingLeft: 10,
		backgroundColor: '#f5f5f5',
	},
	sidebarItemContainerStyle: {
		// position: "absolute",
		// top: "2%",
		right: 0,
		justifyContent: 'center',
		//   backgroundColor: '#f5f5f5',
		//   borderRadius: 50,
		// marginHorizontal: 12,
		paddingTop: 10,
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
	containerStyle?: StyleProp<ViewStyle>;
	rtl?: boolean;
	locale?: 'kor' | 'en';

	//sectionList
	renderSectionHeader?:
		| ((info: {
				section: SectionListData<any, any>;
		  }) => React.ReactElement | null)
		| undefined;
	data: SectionListDataType[];
	sectionHeaderTextStyle?: StyleProp<TextStyle>;
	sectionHeaderStyle?: StyleProp<ViewStyle>;

	itemHeight?: number;
	sectionHeaderHeight?: number;
	footerHeaderHeight?: number;
	separatorHeight?: number;
	listHeaderHeight?: number;

	//sidebar
	renderSidebarItem?: ListRenderItem<string>;
	sidebarContainerStyle?: StyleProp<ViewStyle>;
	sidebarItemStyle?: StyleProp<ViewStyle>;
	sidebarItemTextStyle?: StyleProp<TextStyle>;
	selectedText?: string;
	isSelectedShow?: boolean;
	maxSidebarText?: number;
	sidebarItemHeight?: number;
}

const fadeInDuration = 200;
const fadeOutDuration = 200;
const duration = 1000;

const SectionListSidebar = (
	{
		rtl = false,
		locale = 'en',
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
		...props
	}: SectionListSidebarProps,
	ref: React.LegacyRef<SectionList>,
) => {
	const [isShow, setIsShow] = useState<boolean>(false);
	const [indicatorText, setIndicatorText] = useState<string>('');
	const sidebarRef = useRef<View>();
	// const [visibleSidebar, setVisibleSidebar] = useState<boolean>(false);
	const [sidebarItemHeight, setSidebarItemHeight] = useState<number>(0);
	const timerRef = useRef<NodeJS.Timeout>();
	const sidebarOpacity = useRef(new Animated.Value(0)).current;
	const [defaultSidebarData, setDefaultSidebarData] = useState<any[]>(
		locale === 'kor'
			? [
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
					{key: 'B'},
					{key: 'C'},
					{key: 'D'},
					{key: 'E'},
					{key: 'F'},
					{key: 'G'},
					{key: 'H'},
					{key: 'I'},
					{key: 'J'},
					{key: 'K'},
					{key: 'L'},
					{key: 'M'},
					{key: 'N'},
					{key: 'O'},
					{key: 'P'},
					{key: 'Q'},
					{key: 'R'},
					{key: 'S'},
					{key: 'T'},
					{key: 'U'},
					{key: 'V'},
					{key: 'W'},
					{key: 'X'},
					{key: 'Y'},
					{key: 'Z'},
			  ]
			: [
					{key: 'A'},
					{key: 'B'},
					{key: 'C'},
					{key: 'D'},
					{key: 'E'},
					{key: 'F'},
					{key: 'G'},
					{key: 'H'},
					{key: 'I'},
					{key: 'J'},
					{key: 'K'},
					{key: 'L'},
					{key: 'M'},
					{key: 'N'},
					{key: 'O'},
					{key: 'P'},
					{key: 'Q'},
					{key: 'R'},
					{key: 'S'},
					{key: 'T'},
					{key: 'U'},
					{key: 'V'},
					{key: 'W'},
					{key: 'X'},
					{key: 'Y'},
					{key: 'Z'},
					{key: '#'},
			  ],
	);

	const onLayout = useCallback(
		(event) => {
			const {height} = event.nativeEvent.layout;
			setSidebarItemHeight(13);
			// setSidebarItemHeight(height * (0.95 / defaultSidebarData.length));
		},
		[defaultSidebarData],
	);

	const close = useCallback(() => {
		Animated.timing(sidebarOpacity, {
			delay: 0,
			toValue: 0,
			easing: Easing.out(Easing.ease),
			duration: fadeOutDuration,
			useNativeDriver: false,
		}).start(() => {
			// setVisibleSidebar(false);
		});
	}, [sidebarOpacity]);

	const show = useCallback(() => {
		// setVisibleSidebar(true);
		Animated.timing(sidebarOpacity, {
			delay: 0,
			toValue: 0.7,
			easing: Easing.out(Easing.ease),
			duration: fadeInDuration,
			useNativeDriver: false,
		}).start(() => {
			clearTimeout(timerRef.current);
			timerRef.current = setTimeout(() => {
				close();
			}, duration);
		});
	}, [sidebarOpacity]);

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
			.map((item) => input.indexOf(item.key))
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
		const targetList = setTargetIndexList(data.map((item) => item.key));
		return PanResponder.create({
			onMoveShouldSetPanResponder: () => true,
			onPanResponderGrant: () => {
				setIsShow(true);
			},
			onPanResponderMove: (event, {dx, dy, x0, y0, vx, vy, moveX, moveY}) => {
				show();

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
	}, [sidebarItemHeight]);

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

	const renderDefaultSidebarItem = useCallback(
		({item, index}) => {
			return (
				<View key={item}>
					<TouchableOpacity
						pressRetentionOffset={{bottom: 5, left: 5, right: 5, top: 5}}
						hitSlop={{bottom: 10, left: 10, right: 10, top: 10}}
						style={[styles.sidebarItemStyle, sidebarItemStyle]}>
						<Text
							style={[
								styles.sidebarItemTextStyle,
								sidebarItemTextStyle,
								{
									height: sidebarItemHeight,
								},
							]}>
							{item}
						</Text>
					</TouchableOpacity>
				</View>
			);
		},
		[jumpToSection, sidebarItemStyle, sidebarItemTextStyle, sidebarItemHeight],
	);

	return (
		<View style={[styles.container, containerStyle]} onLayout={onLayout}>
			<TextIndicator isShow={isShow} text={indicatorText} />
			<View style={{flexDirection: rtl === true ? 'row-reverse' : 'row'}}>
				<SectionList
					keyExtractor={sectionKeyExtract}
					getItemLayout={getItemLayout}
					// onScroll={() => {
					//   show();
					//   setVisibleSidebar(true);
					// }}
					showsVerticalScrollIndicator={false}
					renderSectionHeader={renderSectionHeader || defaultSectionHeader}
					ref={ref}
					sections={data}
					{...props}
				/>
				<View style={{width: 24, flexDirection: 'row', alignItems: 'center'}}>
					<View style={{height: 520}}>
						<Animated.View
							ref={sidebarRef}
							style={[
								styles.sidebarItemContainerStyle,
								sidebarContainerStyle,
								// { opacity: sidebarOpacity },
							]}
							{...panResponder.panHandlers}>
							{
								//   visibleSidebar &&
								defaultSidebarData
									.map(function (item) {
										return item.key;
									})
									.map(function (item, index) {
										return renderSidebarItem === undefined
											? renderDefaultSidebarItem({item: item, index: index})
											: renderSidebarItem({item: item, index: index});
									})
							}
						</Animated.View>
					</View>
				</View>
			</View>
		</View>
	);
};

export default memo(forwardRef(SectionListSidebar));
