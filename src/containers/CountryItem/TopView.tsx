import React, { useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AnimatedNumber from '../../components/AnimatedNumber';
import Icon, { Icons } from '../../components/Icon';
import { Colors } from '../../constants/theme';
import { ISummaryCountryData } from '../../utils/types';

interface IProps {
    data: ISummaryCountryData;
    height: number;
    expanded: boolean;
    onClose?: () => void;
}

const CountryItemTopView = (props: IProps) => {

    const [totalCasesNumber, setTotalCasesNumber] = React.useState(Math.floor(props.data.TotalConfirmed / 3));

    const setAnimatedNumber = (current: number, value: number, func: any) => {
        if (totalCasesNumber != value) {
            setTimeout(() => {
                func(value);
            }, 500)
        }
    }

    useEffect(() => {
        if (props.expanded) {
            setAnimatedNumber(totalCasesNumber, props.data.TotalConfirmed, setTotalCasesNumber);
        }
    }, [props.expanded])

    const calcHeight = (percent: number) => {
        return percent * (props.height * 4) / 100
    }

    return (
        <View
            style={{
                height: props.expanded ? props.height * 4 : props.height, width: '100%',
                borderTopLeftRadius: 15, borderTopRightRadius: 15, opacity: props.expanded ? 1.0 : 0,
                shadowColor: "#000", shadowOffset: { width: 0, height: 2, },
                shadowOpacity: 0.23, shadowRadius: 2.62, elevation: 4,
            }}
        >
            <View
                style={{
                    width: '100%', height: calcHeight(20), backgroundColor: Colors.primaryVeryDark,
                    borderTopLeftRadius: 15, borderTopRightRadius: 15, flexDirection: 'row', alignItems: 'center',
                    paddingHorizontal: 15,
                }}
            >
                <Image
                    source={{ uri: `https://flagcdn.com/256x192/${props.data.CountryCode.toLowerCase()}.png` }}
                    style={{ height: calcHeight(15), width: calcHeight(15), resizeMode: 'contain' }}
                />
                <Text style={{ fontWeight: '600', fontSize: 14, color: Colors.white, marginLeft: 10, flex: 1 }}>{props.data.Country}</Text>
            </View>
            <View
                style={{ backgroundColor: Colors.white, flex: 1, paddingHorizontal: 20, paddingVertical: 20 }}
            >
                {props.expanded ? (
                    <>
                        <View style={styles.infoContainer}>
                            <Text style={{ fontWeight: '800', fontSize: 20, color: Colors.primaryVeryDark }}>Total cases: </Text>
                            <AnimatedNumber
                                includeComma
                                animateToNumber={totalCasesNumber}
                                fontStyle={{ fontSize: 20, fontWeight: '600', color: Colors.primaryDark }}
                            />
                        </View>
                        <View style={styles.rowContainer}>
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoLabel}>Total recovered: </Text>
                                <Text style={styles.infoValue}>{props.data.TotalRecovered}</Text>
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoLabel}>Total deaths: </Text>
                                <Text style={styles.infoValue}>{props.data.TotalDeaths}</Text>
                            </View>
                        </View>
                        <Text style={styles.separatorText}>Last 24 hours: </Text>
                        <View style={styles.rowContainer}>
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoLabel}>New cases: </Text>
                                <Text style={styles.infoValue}>{props.data.NewConfirmed}</Text>
                            </View>
                            <View style={styles.infoContainer}>
                                <Text style={styles.infoLabel}>New deaths: </Text>
                                <Text style={styles.infoValue}>{props.data.NewDeaths}</Text>
                            </View>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoLabel}>New recovered: </Text>
                            <Text style={styles.infoValue}>{props.data.NewRecovered}</Text>
                        </View>
                        <View style={styles.rowContainer}>
                            <Text style={[styles.separatorText, { marginTop: 10, fontSize: 16 }]}>Last update: </Text>
                            <Text style={[styles.separatorText, { marginTop: 10, fontSize: 16, color: Colors.primaryDark }]}>{new Date(props.data.Date).toDateString()}</Text>
                        </View>
                    </>
                ) : null}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    infoLabel: {
        fontWeight: '600',
        fontSize: 15
    },
    infoValue: {
        fontSize: 15
    },
    separatorText: {
        fontWeight: '700',
        fontSize: 17,
        marginTop: 15
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})

export default CountryItemTopView;
