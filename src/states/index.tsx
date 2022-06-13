import create from 'zustand';
import { ISummaryCountryData, ISummaryWorldData } from '../utils/types';

interface IStates {
    worldData: ISummaryWorldData;
    countriesData: ISummaryCountryData[];
    setWorldData: (data: ISummaryWorldData) => void;
    setAllCountriesData: (data: ISummaryCountryData[]) => void;
    setCountryData: (countryCode: string, data: ISummaryCountryData) => void;
}

const worldDataInitialState: ISummaryWorldData = {
    NewConfirmed: 0,
    TotalConfirmed: 0,
    NewDeaths: 0,
    TotalDeaths: 0,
    NewRecovered: 0,
    TotalRecovered: 0
}

const useStore = create<IStates>(set => ({
    worldData: worldDataInitialState,
    countriesData: [],
    setWorldData: (data: ISummaryWorldData) => set({ worldData: data }),
    setAllCountriesData: (data: ISummaryCountryData[]) => set({ countriesData: data }),
    setCountryData: (countryCode: string, data: ISummaryCountryData) => set(state => {
        const findIndex = state.countriesData.findIndex(country => country.CountryCode == countryCode);
        if (findIndex != -1) {
            const tmpArr = [...state.countriesData];
            tmpArr[findIndex] = data;
            return ({ countriesData: tmpArr });
        }
        else {
            return {};
        }
    }),
}));

export {
    useStore
}
