import * as React from 'react';
import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/theme';

interface IProps {
    noBottomPadding?: boolean;
}

const PageView = (props: IProps & ViewProps) => {

    const safeAreaInsets = useSafeAreaInsets();

    return (
        <View
            {...props}
            style={[{
                width: '100%',
                flex: 1,
                paddingTop: safeAreaInsets.top,
                paddingBottom: props.noBottomPadding ? 0 : safeAreaInsets.bottom,
                backgroundColor: Colors.white
            },
            props.style]}
        />
    );
}

export default PageView;
