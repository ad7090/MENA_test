import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Text, TextInput, Touchable, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PageView from '../../components/PageView';
import { Colors } from '../../constants/theme';
import CountryItem from '../../containers/CountryItem';
import { useStore } from '../../states';
import { ISummaryCountryData } from '../../utils/types';
import ModalMenu from '../../components/ModalMenu';
import Icon, { Icons } from '../../components/Icon';

const ScreenSize = Dimensions.get("window");

const CountriesScreen = () => {

    const safeAreaInsets = useSafeAreaInsets();
    const generateTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const [countrySearch, setCountrySearch] = useState('');
    const [countryList, setCountryList] = useState<ISummaryCountryData[]>([]);
    const countries = useStore(state => state.countriesData);
    const [descending, setDescending] = useState(false);
    const [sortType, setSortType] = useState<'atoz' | 'confirmed-cases' | 'deaths' | 'recovered'>('atoz');
    const [isLoading, setLoading] = useState(false);

    const sortItems = [
        { label: 'A-Z', value: 'atoz' },
        { label: 'Confirmed Cases', value: 'confirmed-cases' },
        { label: 'Deaths', value: 'deaths' },
        { label: 'Recovered', value: 'recovered' },
    ];

    const generateVisualListData = () => {
        let tmpArr: ISummaryCountryData[] = [];
        if (sortType == 'atoz') {
            tmpArr = countries.sort((a, b) => a.Country.localeCompare(b.Country));
        }
        else if (sortType == 'confirmed-cases') {
            tmpArr = countries.sort((a, b) => a.TotalConfirmed - b.TotalConfirmed);
        }
        else if (sortType == 'deaths') {
            tmpArr = countries.sort((a, b) => a.TotalDeaths - b.TotalDeaths);
        }
        else if (sortType == 'recovered') {
            tmpArr = countries.sort((a, b) => a.TotalRecovered - b.TotalRecovered);
        }

        if (descending) {
            tmpArr = tmpArr.reverse();
        }
        if (countrySearch.length) {
            tmpArr = tmpArr.filter(country => country.Country.toLowerCase().includes(countrySearch.toLocaleLowerCase()));
        }

        setCountryList(tmpArr);
        setLoading(false);
    }

    useEffect(() => {
        setLoading(true);

        if (generateTimerRef.current) {
            clearTimeout(generateTimerRef.current);
        }

        generateTimerRef.current = setTimeout(() => {
            generateVisualListData();
        }, 600);
    }, [countrySearch, sortType, descending]);

    return (
        <PageView style={{}} noBottomPadding>
            <View style={{ width: '100%', paddingVertical: 5, paddingHorizontal: 20, marginTop: 15, flexDirection: 'row' }}>
                <View style={{ width: '100%', height: 50 }} />
            </View>
            {isLoading ? (
                <View style={{ flex: 1, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={'large'} />
                </View>
            ) : (
                <FlatList
                    data={countryList}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10 }}
                    keyExtractor={(item, index) => 'country-row-' + item.Slug + '-' + index}
                    renderItem={({ item, index }) => <CountryItem searchQuery={countrySearch} data={item} />}
                    ListFooterComponent={() => <View style={{ height: 70 + 16 + 24 + safeAreaInsets.bottom }} />}
                />
            )}
            <View style={{
                position: 'absolute', top: 0, left: 0, width: '100%', paddingBottom: 15, paddingHorizontal: 20,
                paddingTop: safeAreaInsets.top + 15, flexDirection: 'row', backgroundColor: Colors.primaryDark
            }}>
                <TextInput
                    style={{
                        height: 50, borderWidth: 1, borderRadius: 15, borderColor: Colors.gray,
                        fontSize: 14, backgroundColor: Colors.white, paddingHorizontal: 10, flex: 1
                    }}
                    placeholder="Search for country..."
                    onChangeText={(text) => setCountrySearch(text)}
                />
                <View style={{ height: 50, width: 50 }}>
                    <ModalMenu
                        data={sortItems}
                        selected={sortType}
                        onPress={(item, index) => {
                            if (item.value == sortType) {
                                setDescending(!descending);
                            }
                            setSortType(item.value);
                        }}
                        buttonComponent={() => {
                            return (
                                <View
                                    style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}
                                >
                                    <Icon type={Icons.MaterialCommunityIcons} name="sort" size={27} color={Colors.white} />
                                </View>
                            )
                        }}
                        selectedItemIconComponent={() => {
                            return (
                                <Icon type={Icons.MaterialCommunityIcons} name={descending ? 'sort-descending' : 'sort-ascending'} size={25} color={Colors.black} />
                            )
                        }}
                    />
                </View>
            </View>
        </PageView>
    );
}

export default CountriesScreen;
