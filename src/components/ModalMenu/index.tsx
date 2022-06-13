import React, { ReactNode, useState } from 'react';
import { View, TouchableOpacity, FlatList, Platform, StyleProp, ViewStyle, Modal, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon, { Icons } from '../Icon';

interface Props {
    data?: { label: string, value: any }[],
    selected?: any;
    onPress?: (item: any, index: number) => void;
    onClose?: () => void;
    buttonComponent?: ReactNode;
    selectedItemIconComponent?: ReactNode;
    style?: StyleProp<ViewStyle>;
}

const ModalMenu = (
    {
        style = {}, buttonComponent = undefined, selected = undefined,
        data = [], onPress = () => { }, onClose = () => { }, selectedItemIconComponent = undefined,
    }: Props) => {

    const [visible, setVisible] = useState(false);
    const safeAreaInsets = useSafeAreaInsets();

    return (
        <View>
            <TouchableOpacity
                style={style}
                onPress={() => {
                    setVisible(true);
                }}
            >
                {typeof buttonComponent == "function" ? buttonComponent() : buttonComponent}
            </TouchableOpacity>
            <Modal
                visible={visible}
                animationType="fade"
                transparent
                onRequestClose={() => setVisible(false)}
                onDismiss={() => setVisible(false)}
            >
                <View style={{ height: '100%', width: '100%', }}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
                        onPress={() => setVisible(false)}
                    />
                    <TouchableOpacity
                        activeOpacity={1}
                        style={{ flex: 1 }}
                        onPress={() => setVisible(false)}
                    />
                    <FlatList
                        style={{ flexGrow: 0, marginHorizontal: '5%', marginTop: safeAreaInsets.top }}
                        data={data}
                        contentContainerStyle={{
                            justifyContent: 'center', backgroundColor: 'white',
                            borderRadius: 12, overflow: 'hidden', width: '100%', maxWidth: '100%'
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    style={{
                                        borderTopWidth: index !== 0 ? 0.7 : 0, borderColor: '#E6E6E8',
                                        backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',
                                    }}
                                    onPress={() => {
                                        setVisible(false);
                                        onPress(item, index);
                                    }}
                                >
                                    <View
                                        style={{
                                            paddingVertical: 16,
                                        }}
                                    >
                                        <Text style={{ color: "#007AFF" }}>{item.label}</Text>
                                    </View>
                                    {selected == item.value ? (
                                        <View style={{
                                            position: 'absolute', top: 0, right: 0, height: '100%', aspectRatio: 1,
                                            justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            {typeof selectedItemIconComponent == "function" ? selectedItemIconComponent() : selectedItemIconComponent}
                                        </View>
                                    ) : null}
                                </TouchableOpacity>
                            )
                        }}
                    />
                    <TouchableOpacity
                        style={{ paddingVertical: 10, marginBottom: safeAreaInsets.bottom }}
                        onPress={() => setVisible(false)}
                    >
                        <View
                            style={{
                                marginHorizontal: '5%', backgroundColor: 'white', elevation: 4,
                                justifyContent: 'center', alignItems: 'center', paddingVertical: 20,
                                marginBottom: 5, borderRadius: 12, width: '90%', maxWidth: '100%'
                            }}
                        >
                            <Text style={{ color: '#FF3B30' }}>Close</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View >

    );
}

export default ModalMenu;