import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, } from 'react-native';
import { useQuery } from 'react-query';
import PageView from '../../components/PageView';
import API from '../../services/api';
import { useStore } from '../../states';
import { IResponseGetSummary } from '../../utils/types';
import shallow from 'zustand/shallow'
import Navigation from '../../services/navigation';

const SplashScreen = () => {

    const { setAllCountriesData, setWorldData } = useStore(state => ({ setAllCountriesData: state.setAllCountriesData, setWorldData: state.setWorldData }), shallow)

    const { isLoading, error, data } = useQuery('summaryData', () =>
        API.get<IResponseGetSummary>("summary")
    );

    useEffect(() => {
        if (isLoading == false) {
            if (data && data.Global) {
                setWorldData(data.Global);
                setAllCountriesData(data.Countries);
                Navigation.navigate("BottomTab");
            }
        }
    }, [isLoading]);


    if (isLoading) {
        return (
            <PageView style={{ justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} />
            </PageView>
        );
    }

    return (
        <PageView style={{}} noBottomPadding>

        </PageView>
    );
}

export default SplashScreen;
