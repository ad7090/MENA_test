import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineGraph } from 'react-native-graph';
import { GraphPoint } from 'react-native-graph/lib/typescript/LineGraphProps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from 'react-query';
import AnimatedNumber from '../../components/AnimatedNumber';
import PageView from '../../components/PageView';
import { Colors } from '../../constants/theme';
import CountryItem from '../../containers/CountryItem';
import Graph from '../../containers/Graph';
import WaveView from '../../components/WaveView';
import API from '../../services/api';
import Navigation from '../../services/navigation';
import { useStore } from '../../states';
import { IWorldTotalData, ISummaryCountryData, ISummaryWorldData } from '../../utils/types';

const ScreenSize = Dimensions.get("window");

type GraphType = 'confirmed-cases' | 'deaths' | 'recovered';

const WorldScreen = () => {

    const graphTypes: { title: string, label: string, type: GraphType }[] = [
        { title: 'Total confirmed cases', label: 'Confirmed Cases', type: 'confirmed-cases' },
        { title: 'Total deaths', label: 'Deaths', type: 'deaths' },
        { title: 'Total recovered', label: 'Recovered', type: 'recovered' },
    ]

    const safeAreaInsets = useSafeAreaInsets();
    const worldData = useStore(state => state.worldData);
    const countriesData = useStore(state => state.countriesData);
    const [countryList, setCountryList] = useState<ISummaryCountryData[]>([]);
    const [totalCasesNumber, setTotalCasesNumber] = React.useState(Math.floor(worldData.TotalConfirmed / 3));
    const totalData = useRef<IWorldTotalData[]>([]);
    const [historyData, setHistoryData] = useState<GraphPoint[]>([]);
    const [pointData, setPointData] = useState<GraphPoint>({ value: 0, date: new Date() });
    const tempPointData = useRef<GraphPoint>({ value: 0, date: new Date() });
    const [selectedGraphType, setSelectedGraphType] = useState<GraphType>('confirmed-cases');

    const { isLoading, error, data } = useQuery('worldData', () =>
        API.get<IWorldTotalData[]>("world")
    );

    useEffect(() => {
        if (worldData.TotalConfirmed) {
            setTimeout(() => {
                setTotalCasesNumber(worldData.TotalConfirmed);
            }, 300);
        }
    }, [worldData]);

    useEffect(() => {
        if (countriesData.length) {
            let tmpArr = [...countriesData];
            tmpArr = tmpArr.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed).filter((_, index) => index < 5);
            setCountryList(tmpArr);
        }
    }, [countriesData]);

    useEffect(() => {
        if (isLoading == false) {
            if (data) {
                const sortedData = data.sort((a, b) => (new Date(a.Date).getTime()) - (new Date(b.Date).getTime()));
                const tmpArr: GraphPoint[] = sortedData.map(item => {
                    return {
                        value: item.TotalConfirmed,
                        date: new Date(item.Date)
                    }
                });

                totalData.current = sortedData;
                setHistoryData(tmpArr);
            }
        }
    }, [isLoading]);

    const drawGraph = (item: GraphType) => {
        if (item == 'confirmed-cases') {
            setSelectedGraphType(item);
            const tmpArr = totalData.current.map(world => {
                return {
                    value: world.TotalConfirmed,
                    date: new Date(world.Date)
                }
            }).sort((a, b) => a.date.getTime() - b.date.getTime());

            setHistoryData(tmpArr);
            setPointData(tmpArr[tmpArr.length - 1]);
        }
        else if (item == 'deaths') {
            setSelectedGraphType(item);
            const tmpArr = totalData.current.map(world => {
                return {
                    value: world.TotalDeaths,
                    date: new Date(world.Date)
                }
            }).sort((a, b) => a.date.getTime() - b.date.getTime());

            setHistoryData(tmpArr);
            setPointData(tmpArr[tmpArr.length - 1]);
        }
        else if (item == 'recovered') {
            setSelectedGraphType(item);
            const tmpArr = totalData.current.map(world => {
                return {
                    value: world.TotalRecovered,
                    date: new Date(world.Date)
                }
            }).sort((a, b) => a.date.getTime() - b.date.getTime());

            setHistoryData(tmpArr);
            setPointData(tmpArr[tmpArr.length - 1]);
        }
    }

    return (
        <PageView style={{ paddingHorizontal: 15, }}>
            <View style={{ width: ScreenSize.width, position: 'absolute', top: 0, left: 0, height: 150 }}>
                <WaveView
                    height={100}
                    width={ScreenSize.width * 3.2}
                    amplitude={7}
                    frequency={2}
                    offset={65}
                    color={Colors.primaryDark}
                />
            </View>
            <View style={{ marginTop: 15, width: '100%', height: 150 - safeAreaInsets.top - 25 }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: Colors.white }}>World Coronavirus Updates:</Text>
            </View>
            <ScrollView style={{ marginTop: 15 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: safeAreaInsets.bottom + 70 + 10 }}>
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
                            <Text style={styles.infoValue}>{worldData.TotalRecovered}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoLabel}>Total deaths: </Text>
                            <Text style={styles.infoValue}>{worldData.TotalDeaths}</Text>
                        </View>
                    </View>
                    <Text style={styles.separatorText}>Last 24 hours: </Text>
                    <View style={styles.rowContainer}>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoLabel}>New cases: </Text>
                            <Text style={styles.infoValue}>{worldData.NewConfirmed}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoLabel}>New deaths: </Text>
                            <Text style={styles.infoValue}>{worldData.NewDeaths}</Text>
                        </View>
                    </View>
                    <View style={[styles.infoContainer, { paddingHorizontal: 10 }]}>
                        <Text style={styles.infoLabel}>New recovered: </Text>
                        <Text style={styles.infoValue}>{worldData.NewRecovered}</Text>
                    </View>
                </>
                {isLoading ? (
                    <View style={{ flex: 1, marginTop: 50 }}>
                        <ActivityIndicator size="large" />
                    </View>
                ) : (
                    <View style={{ marginTop: '10%', width: '100%' }}>
                        <Text style={{ fontWeight: '800', fontSize: 20, color: Colors.primaryVeryDark }}>Countries with most cases: </Text>
                        {countryList.map((country, index) => {
                            return (
                                <CountryItem noBottomView key={country.Country + '-' + index} data={country} searchQuery='' />
                            )
                        })}
                        <View style={{ width: '100%', alignItems: 'center', marginTop: 20, marginBottom: 10 }}>
                            <TouchableOpacity
                                onPress={() => Navigation.navigate("Countries")}
                                style={{ width: '50%', alignItems: 'center', paddingVertical: 10 }}
                            >
                                <Text style={{ fontWeight: '500', color: Colors.primaryVeryDark }}>View all</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: '100%', height: 60, marginBottom: 20 }}>
                            <ScrollView
                                showsHorizontalScrollIndicator={false}
                                horizontal
                                contentContainerStyle={{ alignItems: 'center', height: 50 }}
                            >
                                {graphTypes.map(item => {
                                    return (
                                        <TouchableOpacity
                                            disabled={selectedGraphType == item.type}
                                            key={'selection-' + item.type}
                                            onPress={() => {
                                                if (selectedGraphType != item.type) {
                                                    drawGraph(item.type);
                                                }
                                            }}
                                            style={{
                                                height: 40, borderRadius: 40, paddingHorizontal: 18,
                                                backgroundColor: selectedGraphType == item.type ? Colors.primaryVeryDark : Colors.primaryDark,
                                                justifyContent: 'center', marginRight: 4, marginLeft: 7
                                            }}
                                        >
                                            <Text style={{ color: Colors.white, fontWeight: '700', fontSize: 14 }}>{item.label}</Text>
                                        </TouchableOpacity>
                                    )
                                })}
                            </ScrollView>
                        </View>
                        <Graph
                            title={graphTypes.find(item => item.type == selectedGraphType)?.title}
                            graphData={historyData}
                            max={(() => {
                                if (selectedGraphType == 'confirmed-cases')
                                    return worldData.TotalConfirmed
                                else if (selectedGraphType == 'deaths')
                                    return worldData.TotalDeaths
                                else if (selectedGraphType == 'recovered')
                                    return worldData.TotalRecovered
                                else
                                    return 0;
                            })()}
                            onGestureEnd={() => {
                                setPointData(tempPointData.current)
                            }}
                            onPointSelected={(point) => {
                                tempPointData.current = point
                            }}
                            selectedPoint={pointData}
                            style={{
                                width: '100%',
                                aspectRatio: 1.4,
                                paddingRight: 20
                            }}
                        />
                    </View>
                )}
            </ScrollView>
        </PageView>
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
        paddingHorizontal: 10,
        marginTop: 5
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    }
})

export default WorldScreen;
