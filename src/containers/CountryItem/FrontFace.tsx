import React, { useEffect, useRef, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import HighlightedText from '../../components/HighlightedText';
import { Colors } from '../../constants/theme';
import { ISummaryCountryData } from '../../utils/types';

interface IProps {
    data: ISummaryCountryData;
    height: number;
    searchQuery: string;
    onPress: () => void
}

const CountryItemFrontFace = (props: IProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.9}
            style={{
                height: props.height, width: '100%', backgroundColor: Colors.white,
                shadowColor: "#000", shadowOffset: { width: 0, height: 1, },
                shadowOpacity: 0.20, shadowRadius: 1.41, elevation: 2,
                borderRadius: 15, flexDirection: 'row', paddingHorizontal: '5%',
                alignItems: 'center'
            }}
            onPress={() => props.onPress()}
        >
            <Image
                source={{ uri: `https://flagcdn.com/256x192/${props.data.CountryCode.toLowerCase()}.png` }}
                style={{ height: props.height / 1.2, width: props.height / 1.2, resizeMode: 'contain' }}
            />
            <View style={{ paddingHorizontal: 10, justifyContent: 'center', alignItems: 'flex-start', flex: 1 }}>
                <HighlightedText
                    highlightStyle={{ backgroundColor: 'yellow' }}
                    searchWords={[props.searchQuery]}
                    textToHighlight={props.data.Country}
                    style={{ fontWeight: '600', fontSize: 16 }}
                />
                <Text style={{ fontWeight: '400', fontSize: 14, color: Colors.primaryDark }}>{props.data.CountryCode}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default CountryItemFrontFace;
