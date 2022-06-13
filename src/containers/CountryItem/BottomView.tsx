import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { LineGraph } from 'react-native-graph';
import { GraphPoint } from 'react-native-graph/lib/typescript/LineGraphProps';
import { Colors } from '../../constants/theme';
import API from '../../services/api';
import { nFormatter } from '../../utils/functions';
import { ICountryTotalData, ISummaryCountryData } from '../../utils/types';
import Graph from '../Graph';

interface IProps {
    data: ISummaryCountryData;
    height: number;
    expanded: boolean;
}

const CountryItemBottomView = (props: IProps) => {

    const [totalData, setTotalData] = useState<ICountryTotalData[]>([]);
    const [graphData, setGraphData] = useState<GraphPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [pointData, setPointData] = useState<GraphPoint | undefined>(undefined);
    const [selectedGraphType, setSelectedGraphType] = useState('Confirmed Cases');
    const tempPointData = useRef<GraphPoint>({ value: 0, date: new Date() });

    useEffect(() => {
        if (props.expanded && totalData.length < 1) {
            API.get<ICountryTotalData[]>(`country/${props.data.Slug}`)
                .then(response => {
                    if (response && response.length) {
                        setTotalData(response);
                        const tmpArr = response.map(country => {
                            return {
                                value: country.Confirmed,
                                date: new Date(country.Date)
                            }
                        }).sort((a, b) => a.date.getTime() - b.date.getTime());

                        setGraphData(tmpArr);
                    }
                })
                .catch(error => console.log(error))
                .finally(() => {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 1000)
                });
        }
        else {
            if (totalData.length) {
                if (props.expanded) {
                    setTimeout(() => {
                        drawGraph(selectedGraphType);
                    }, 800);
                }
                else {
                    setGraphData([]);
                }
            }
        }
    }, [props.expanded]);

    const drawGraph = (item: string) => {
        if (item == 'Confirmed Cases') {
            setSelectedGraphType(item);
            const tmpArr = totalData.map(country => {
                return {
                    value: country.Confirmed,
                    date: new Date(country.Date)
                }
            }).sort((a, b) => a.date.getTime() - b.date.getTime());

            setGraphData(tmpArr);
            setPointData(tmpArr[tmpArr.length - 1]);
        }
        else if (item == 'Deaths') {
            setSelectedGraphType(item);
            const tmpArr = totalData.map(country => {
                return {
                    value: country.Deaths,
                    date: new Date(country.Date)
                }
            }).sort((a, b) => a.date.getTime() - b.date.getTime());

            setGraphData(tmpArr);
            setPointData(tmpArr[tmpArr.length - 1]);
        }
        else if (item == 'Recovered') {
            setSelectedGraphType(item);
            const tmpArr = totalData.map(country => {
                return {
                    value: country.Recovered,
                    date: new Date(country.Date)
                }
            }).sort((a, b) => a.date.getTime() - b.date.getTime());

            setGraphData(tmpArr);
            setPointData(tmpArr[tmpArr.length - 1]);
        }
    }

    const calcHeight = (percent: number) => {
        return percent * (props.height * 4) / 100;
    }

    if (isLoading) {
        return (
            <View
                style={{
                    height: props.expanded ? props.height * 4 : props.height, width: '100%',
                    borderBottomLeftRadius: 15, borderBottomRightRadius: 15, opacity: props.expanded ? 1.0 : 0,
                    shadowColor: "#000", shadowOffset: { width: 0, height: 2, },
                    shadowOpacity: 0.23, shadowRadius: 2.62, elevation: 4, backgroundColor: 'white'
                }}
            >
                <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={'large'} />
                </View>
            </View>
        );
    }

    return (
        <View
            style={{
                height: props.expanded ? props.height * 4 : props.height, width: '100%',
                borderBottomLeftRadius: 15, borderBottomRightRadius: 15, opacity: props.expanded ? 1.0 : 0,
                shadowColor: "#000", shadowOffset: { width: 0, height: 2, },
                shadowOpacity: 0.23, shadowRadius: 2.62, elevation: 4, backgroundColor: Colors.white
            }}
        >
            <View style={{ width: '100%', flex: 1, paddingRight: 10, paddingBottom: 10 }}>
                <Graph
                    graphData={graphData}
                    selectedPoint={pointData}
                    max={(() => {
                        if (selectedGraphType == 'Confirmed Cases')
                            return props.data.TotalConfirmed
                        else if (selectedGraphType == 'Deaths')
                            return props.data.TotalDeaths
                        else if (selectedGraphType == 'Recovered')
                            return props.data.TotalRecovered
                        else
                            return 0;
                    })()}
                    onGestureEnd={() => {
                        if (tempPointData.current)
                            setPointData(tempPointData.current)
                    }}
                    onPointSelected={(point) => {
                        tempPointData.current = point
                    }}
                    style={{
                        width: '100%',
                        height: calcHeight(70),
                    }}
                />
                <View style={{ width: '100%', height: calcHeight(30) }}>
                    <ScrollView
                        horizontal
                        contentContainerStyle={{ alignItems: 'center', height: calcHeight(30) }}
                    >
                        {['Confirmed Cases', 'Deaths', 'Recovered'].map(item => {
                            return (
                                <TouchableOpacity
                                    disabled={selectedGraphType == item}
                                    key={'selection-' + item}
                                    onPress={() => {
                                        if (selectedGraphType != item) {
                                            drawGraph(item);
                                        }
                                    }}
                                    style={{
                                        height: calcHeight(17), borderRadius: calcHeight(20), paddingHorizontal: 18,
                                        backgroundColor: selectedGraphType == item ? Colors.primaryVeryDark : Colors.primaryDark,
                                        justifyContent: 'center', marginRight: 4, marginLeft: 7
                                    }}
                                >
                                    <Text style={{ color: Colors.white, fontWeight: '700', fontSize: 14 }}>{item}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}

export default CountryItemBottomView;
