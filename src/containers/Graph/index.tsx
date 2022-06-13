import React, { } from 'react';
import { StyleProp, Text, View, ViewStyle } from 'react-native';
import { LineGraph } from 'react-native-graph';
import { GraphPoint } from 'react-native-graph/lib/typescript/LineGraphProps';
import { Colors } from '../../constants/theme';
import { nFormatter } from '../../utils/functions';

interface IProps {
    graphData: GraphPoint[];
    max?: number;
    title?: string;
    selectedPoint?: GraphPoint;
    onPointSelected?: (point: GraphPoint) => void;
    onGestureEnd?: () => void;
    style?: StyleProp<ViewStyle>;
}

const Graph = (props: IProps) => {
    return (
        <View style={[{ flexDirection: 'row', }, props.style]}>
            {<View style={{ justifyContent: 'space-between', width: '12%', height: '100%' }}>
                {props.max ? (() => {
                    const numbers = [props.max, 0];
                    return numbers.map(num => <Text key={'chart-left-' + num} style={{ fontSize: 10, textAlign: 'right', paddingRight: 4, color: Colors.primaryDark }}>{nFormatter(num)}</Text>);
                })() : null}
            </View>}
            <View style={{ flex: 1, height: '100%', backgroundColor: 'transparent', borderLeftWidth: 1, borderBottomWidth: 1, borderColor: Colors.primaryLite }}>
                <LineGraph
                    style={{
                        width: '100%',
                        height: '100%',
                        top: 3
                    }}
                    resetPositionOnRelease={false}
                    points={props.graphData}
                    animated={true}
                    gestureHoldDuration={50}
                    color={Colors.primary}
                    enablePanGesture={true}
                    selectionDotShadowColor={Colors.primaryDark}
                    onGestureEnd={() => {
                        if (props.onGestureEnd)
                            props.onGestureEnd();
                    }}
                    onPointSelected={(point) => {
                        if (props.onPointSelected)
                            props.onPointSelected(point);
                    }}
                />
                {props.selectedPoint != undefined ? (
                    <View style={{ position: 'absolute', top: 10, left: 20 }}>
                        <Text style={{ fontSize: 12, fontWeight: '500', color: Colors.primaryDark }}>{props.selectedPoint.value}</Text>
                        <Text style={{ fontSize: 12 }}>{props.selectedPoint.date.toDateString()}</Text>
                    </View>
                ) : null}
                {props.title ? (
                    <View style={{ width: '100%', alignItems: 'center', marginTop: 10 }}>
                        <Text style={{ color: Colors.primaryDark, fontWeight: '600' }}>{props.title}</Text>
                    </View>
                ) : null}
            </View>
        </View>
    );
}

export default Graph;
