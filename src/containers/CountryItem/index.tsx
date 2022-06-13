import React, { useEffect, useRef, useState } from 'react';
import { Image, LayoutAnimation, Text, TouchableOpacity, View } from 'react-native';
import ExpandableView from '../../components/ExpandableView';
import Icon, { Icons } from '../../components/Icon';
import { Colors } from '../../constants/theme';
import { ISummaryCountryData } from '../../utils/types';
import CountryItemBottomView from './BottomView';
import CountryItemFrontFace from './FrontFace';
import CountryItemTopView from './TopView';

const ITEM_HEIGHT = 60;

const Spacer = ({ height }: { height: number }) => (
    <View
        pointerEvents="none"
        style={{
            height,
        }}
    />
);

interface IProps {
    data: ISummaryCountryData;
    searchQuery: string;
    noBottomView?: boolean;
}

const CountryItem = (props: IProps) => {

    const [expanded, expandView] = useState(false);
    const [height, setHeight] = useState(ITEM_HEIGHT);

    const calcHeight = (percent: number) => {
        return percent * (ITEM_HEIGHT * 4) / 100;
    }

    return (
        <View style={{ zIndex: 1 }}>
            <View style={{ height: ITEM_HEIGHT, marginTop: 10, width: '100%' }}>
                <ExpandableView
                    expanded={expanded}
                    perspective={300}
                    endingPadding={ITEM_HEIGHT * 3}
                    onAnimationStart={(duration, height) => {
                        const isExpanding = expanded;

                        const animationConfig = {
                            duration,
                            update: {
                                type: isExpanding ? LayoutAnimation.Types.easeOut : LayoutAnimation.Types.easeIn,
                                // @ts-ignore
                                property: LayoutAnimation.Properties.height,
                            },
                        };

                        LayoutAnimation.configureNext(animationConfig);

                        setHeight(height);
                    }}
                    renderBackface={() => {
                        if (props.noBottomView) {
                            return <View />
                        }
                        return <CountryItemBottomView expanded={expanded} height={ITEM_HEIGHT} data={props.data} />
                    }}
                    renderFrontface={() => <CountryItemFrontFace searchQuery={props.searchQuery} height={ITEM_HEIGHT} data={props.data} onPress={() => expandView(true)} />}
                >
                    <CountryItemTopView expanded={expanded} height={ITEM_HEIGHT} data={props.data} />
                </ExpandableView>
                {expanded ? (
                    <TouchableOpacity
                        style={{ position: 'absolute', top: 0, right: 0, height: calcHeight(20), width: calcHeight(20), justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => expandView(false)}
                    >
                        <Icon type={Icons.FontAwesome} name="close" size={30} color={Colors.primary} />
                    </TouchableOpacity>
                ) : null}
            </View>
            <Spacer height={height - (!expanded ? ITEM_HEIGHT : (props.noBottomView ? -ITEM_HEIGHT : (-ITEM_HEIGHT * 5)))} />
        </View>
    );
}

export default CountryItem;
