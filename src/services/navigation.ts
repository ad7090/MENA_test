import { NavigationContainerRef, ParamListBase } from "@react-navigation/native";

export default class Navigation {

    private static navigationInstance: NavigationContainerRef<ParamListBase> | null = null;

    static setInstance(ref: NavigationContainerRef<ParamListBase> | null) {
        this.navigationInstance = ref;
    }

    static navigate(route: string, params?: any) {
        if (this.navigationInstance) {
            this.navigationInstance.navigate(route, params);
        }
    }

    static goBack() {
        if (this.navigationInstance) {
            this.navigationInstance.goBack();
        }
    }
}