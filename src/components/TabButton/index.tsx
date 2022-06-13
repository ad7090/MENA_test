import { BottomTabBarButtonProps, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect, useRef } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ViewProps, ViewStyle } from 'react-native'
import Icon, { IconProps, Icons } from '../Icon';
import { Colors } from '../../constants/theme';
import * as Animatable from 'react-native-animatable';


const animate1 = { 0: { scale: 0.5, translateY: 7 }, 0.92: { translateY: -14 }, 1: { scale: 1.2, translateY: -12 } }
const animate2 = { 0: { scale: 1.2, translateY: -18 }, 1: { scale: 1, translateY: 20 } }

const circle1 = { 0: { scale: 0.8 }, 0.5: { scale: 0.85 }, 0.8: { scale: 0.9 }, 1: { scale: 1 } }
const circle2 = { 0: { scale: 1 }, 1: { scale: 0.0 } }


const TabButton = (props: BottomTabBarButtonProps & {
    item: {
        route: string;
        label: string;
        type: typeof Icons.FontAwesome5;
        icon: string;
        component: () => JSX.Element;
    }
}) => {

    const { item, onPress, accessibilityState } = props;
    const focused = accessibilityState ? accessibilityState.selected : false;
    const viewRef = useRef<Animatable.View>(null);
    const circleRef = useRef<Animatable.View>(null);
    const textRef = useRef<Animatable.View>(null);

    useEffect(() => {
        if (focused) {
            if (viewRef.current && circleRef.current && textRef.current) {
                // @ts-ignore
                viewRef.current.animate(animate1);
                // @ts-ignore
                circleRef.current.animate(circle1);
                // @ts-ignore
                textRef.current.transitionTo({ scale: 1 });
            }
        } else {
            if (viewRef.current && circleRef.current && textRef.current) {
                // @ts-ignore
                viewRef.current.animate(animate2);
                // @ts-ignore
                circleRef.current.animate(circle2);
                // @ts-ignore
                textRef.current.transitionTo({ scale: 0 });
            }
        }
    }, [focused])

    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={1}
            style={styles.container}
        >
            <Animatable.View
                // @ts-ignore
                ref={viewRef}
                duration={400}
                style={styles.container}
            >
                <View style={[styles.btn, focused ? {
                    shadowColor: "#000",
                    shadowOffset: {
                        width: 0,
                        height: 1,
                    },
                    shadowOpacity: 0.22,
                    shadowRadius: 2.22,
                    elevation: 3,
                } : {}]}>
                    <Animatable.View
                        // @ts-ignore
                        ref={circleRef}
                        style={styles.circle}
                    />
                    {/* @ts-ignore */}
                    <Icon type={item.type} name={item.icon} color={focused ? Colors.white : Colors.primary} />
                </View>
                <Animatable.Text
                    // @ts-ignore
                    ref={textRef}
                    style={styles.text}
                >
                    {item.label}
                </Animatable.Text>
            </Animatable.View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 4,
        borderColor: Colors.white,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    circle: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 25,
    },
    text: {
        fontSize: 10,
        textAlign: 'center',
        fontWeight: '700',
        color: Colors.primaryDark,
    }
})

export default TabButton;
