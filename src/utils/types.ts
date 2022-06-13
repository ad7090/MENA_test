
export interface IWorldTotalData {
    NewConfirmed: number;
    TotalConfirmed: number;
    NewDeaths: number;
    TotalDeaths: number;
    NewRecovered: number;
    TotalRecovered: number;
    Date: string;
};

export interface ISummaryWorldData {
    NewConfirmed: number;
    TotalConfirmed: number;
    NewDeaths: number;
    TotalDeaths: number;
    NewRecovered: number;
    TotalRecovered: number;
}

export interface ISummaryCountryData {
    Country: string;
    CountryCode: string;
    Slug: string;
    NewConfirmed: number;
    TotalConfirmed: number;
    NewDeaths: number;
    TotalDeaths: number;
    NewRecovered: number;
    TotalRecovered: number;
    Date: string;
}

export interface ICountryTotalData {
    ID: string,
    Country: string,
    CountryCode: string,
    Province: string,
    City: string,
    CityCode: string,
    Lat: string,
    Lon: string,
    Confirmed: number,
    Deaths: number,
    Recovered: number,
    Active: number,
    Date: string
}

export interface IResponseGetSummary {
    Global: ISummaryWorldData;
    Countries: ISummaryCountryData[];
}
