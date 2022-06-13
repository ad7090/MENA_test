import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Animated, StyleSheet, Platform } from 'react-native';
import invariant from 'invariant';
import transformUtil from './utils';

const rootDefaultProps = {
    collapse: async (foldViews: ExpandableView[]) => {
        const reversedFoldViews = [...foldViews].reverse();
        for (const foldView of reversedFoldViews) {
            await foldView.collapse();
        }
    },
    expand: async (foldViews: ExpandableView[]) => {
        for (const foldView of foldViews) {
            await foldView.expand();
        }
    },
    perspective: 1000,
};

interface IProps {
    children: JSX.Element,
    flipDuration: number,
    renderBackface: () => JSX.Element,
    renderFrontface: () => JSX.Element,
    renderLoading?: () => JSX.Element,
    collapse?: () => void,
    expand?: () => void,
    expanded?: boolean,
    onAnimationEnd?: (duration: number, height: number) => void,
    onAnimationStart?: (duration: number, height: number) => void,
    perspective?: number,
    endingPadding?: number,
}

export default class ExpandableView extends Component<IProps, any> {

    static childContextTypes = {
        registerComponent: PropTypes.func,
    };

    static contextTypes = {
        registerComponent: PropTypes.func,
    };

    static defaultProps = {
        flipDuration: 280,
    };

    isRoot: any = false;
    managedComponents: any[] = [];
    frontFaceRef: Animated.AnimatedComponent<typeof View> | null = null;
    backFaceRef: Animated.AnimatedComponent<typeof View> | null = null;
    baseRef: View | null = null;

    constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            rotateXfront: new Animated.Value(0),
            rotateXback: new Animated.Value(-180),
            baseLayout: null,
            rasterize: false,
        };

        this.isRoot = !context.registerComponent;
        this.managedComponents = [];

        this.collapse = this.collapse.bind(this);
        this.expand = this.expand.bind(this);
        this.getBaseHeight = this.getBaseHeight.bind(this);
        this.getFlipDuration = this.getFlipDuration.bind(this);
        this.handleBaseLayout = this.handleBaseLayout.bind(this);
        this.rasterize = this.rasterize.bind(this);
        this.renderBackface = this.renderBackface.bind(this);
        this.renderBase = this.renderBase.bind(this);
        this.renderFrontface = this.renderFrontface.bind(this);
        this.setBackFaceRef = this.setBackFaceRef.bind(this);
        this.setBaseRef = this.setBaseRef.bind(this);
        this.setFrontFaceRef = this.setFrontFaceRef.bind(this);


        if (!this.isRoot) {
            const blacklistedProps = [
                'collapse',
                'expand',
                'expanded',
                'onAnimationEnd',
                'onAnimationStart',
                'perspective',
            ];

            const invalidProps = blacklistedProps.reduce((invalid: any[], key) => {
                // @ts-ignore
                if (this.props[key]) {
                    invalid.push(key);
                }
                return invalid;
            }, []);

            invariant(
                invalidProps.length === 0,
                `${invalidProps.join(', ')} cannot be set on a nested ExpandableView`,
            );
        }
    }

    getChildContext(): Object {
        return {
            registerComponent: (pseudoRef: any) => {
                if (this.isRoot) {
                    this.managedComponents.push(pseudoRef);
                } else {
                    this.context.registerComponent(pseudoRef);
                }
            },
        };
    }

    componentDidMount() {
        this.state.rotateXfront.addListener(({ value }: any) => {
            this.flushTransform(this.frontFaceRef, value, this.state.frontFaceOriginY);
        });

        this.state.rotateXback.addListener(({ value }: any) => {
            this.flushTransform(this.backFaceRef, value, this.state.backFaceOriginY);
        });

        const pseudoRef = {
            expand: this.expand,
            collapse: this.collapse,
            rasterize: this.rasterize,
            getBaseHeight: this.getBaseHeight,
            getFlipDuration: this.getFlipDuration,
        };

        if (this.isRoot) {
            this.managedComponents.push(pseudoRef);
        } else {
            this.context.registerComponent(pseudoRef);
        }
    }

    componentDidUpdate(prevProps: IProps) {
        if (this.isRoot) {
            if (this.props.expanded !== prevProps.expanded) {
                this.flip(this.props.expanded ? this.props.expanded : false);
            }
        }
    }

    componentWillUnmount() {
        // FIXME(jmurzy) Possible memory leak
        this.managedComponents = [];
    }

    setFrontFaceRef(ref: typeof this.frontFaceRef) {
        this.frontFaceRef = ref;
    }

    setBackFaceRef(ref: typeof this.backFaceRef) {
        this.backFaceRef = ref;
    }

    setBaseRef(ref: typeof this.baseRef) {
        this.baseRef = ref;
    }

    getBaseHeight() {
        const baseLayout = this.state.baseLayout;
        if (!baseLayout) {
            return 0;
        }

        return baseLayout.height;
    }

    getFlipDuration() {
        return this.props.flipDuration;
    }

    flushTransform(ref: any, dx: number, y: number) {
        const matrix = transformUtil.createIdentityMatrix();
        const rotate = transformUtil.rotateX(dx);
        transformUtil.origin(matrix, { x: 0, y, z: 0 });
        transformUtil.applyPerspective(
            matrix,
            this.props.perspective || rootDefaultProps.perspective,
        );
        transformUtil.multiplyInto(matrix, matrix, rotate);

        ref.setNativeProps({
            style: {
                transform: [
                    {
                        matrix,
                    },
                ],
            },
        });
    }

    expand() {
        const duration = this.props.flipDuration;

        const animations = Animated.parallel([
            Animated.timing(this.state.rotateXfront, {
                toValue: 180,
                duration,
                useNativeDriver: false
            }),
            Animated.timing(this.state.rotateXback, {
                toValue: 0,
                duration,
                useNativeDriver: false
            }),
        ]);

        return new Promise(resolve => animations.start(resolve));
    }

    collapse() {
        const duration = this.props.flipDuration;

        const animations = Animated.parallel([
            Animated.timing(this.state.rotateXfront, {
                toValue: 0,
                duration,
                useNativeDriver: false
            }),
            Animated.timing(this.state.rotateXback, {
                toValue: -180,
                duration,
                useNativeDriver: false
            }),
        ]);

        return new Promise(resolve => animations.start(resolve));
    }

    rasterize(shouldRasterize: boolean) {
        return new Promise((resolve: any) => {
            this.setState({
                rasterize: shouldRasterize,
            }, resolve);
        });
    }

    async flip(expanded: boolean) {
        if (!this.isRoot) {
            return;
        }

        const totalDuration = this.managedComponents.reduce(
            (total, pseudoRef) => total + pseudoRef.getFlipDuration(),
            0,
        );

        let height = this.state.baseLayout.height;
        if (expanded) {
            height = this.managedComponents.reduce(
                (total, pseudoRef) => total + pseudoRef.getBaseHeight(),
                height,
            );
        }

        if (this.props.onAnimationStart) {
            this.props.onAnimationStart(totalDuration, height);
        }

        if (expanded) {
            for (const pseudoRef of this.managedComponents) {
                await pseudoRef.rasterize(true);
            }

            const expand = this.props.expand || rootDefaultProps.expand;
            await expand(this.managedComponents);
        } else {
            const collapse = this.props.collapse || rootDefaultProps.collapse;
            await collapse(this.managedComponents);

            for (const pseudoRef of this.managedComponents) {
                await pseudoRef.rasterize(false);
            }
        }

        if (this.props.onAnimationEnd) {
            this.props.onAnimationEnd(totalDuration, height);
        }
    }

    handleBaseLayout(e: any) {
        const layout = e.nativeEvent.layout;

        this.setState({
            baseLayout: layout,
            frontFaceOriginY: layout.height / 2,
            backFaceOriginY: -layout.height / 2,
        }, () => {
            this.flushTransform(
                this.frontFaceRef,
                this.state.rotateXfront.__getValue(),
                this.state.frontFaceOriginY,
            );

            this.flushTransform(
                this.backFaceRef,
                this.state.rotateXback.__getValue(),
                this.state.backFaceOriginY,
            );
        });
    }

    renderFrontface() {
        if (this.state.baseLayout) {
            const { height, width, y, x } = this.state.baseLayout;
            const faceStyle = {
                height,
                width,
                top: y,
                left: x,
                ...Platform.select({
                    ios: {
                        zIndex: 0,
                    },
                }),
            };

            const pointerEvents = this.props.expanded ? 'box-none' : 'auto';

            return (
                <Animated.View
                    ref={this.setFrontFaceRef}
                    style={[styles.face, faceStyle]}
                    pointerEvents={pointerEvents}
                >
                    {
                        this.props.renderFrontface()
                    }
                </Animated.View>
            );
        }

        return null;
    }

    renderBackface() {
        if (this.state.baseLayout) {
            const { height, width, y, x } = this.state.baseLayout;
            const faceStyle = {
                height: height + this.props.endingPadding,
                width,
                top: y + height + this.props.endingPadding,
                left: x,
                ...Platform.select({
                    ios: {
                        zIndex: 1,
                    },
                }),
            };

            const rasterize = this.state.rasterize;

            let pointerEvents: 'auto' | 'box-none' | 'none' = this.props.expanded ? 'auto' : 'box-none';

            if (this.isRoot) {
                pointerEvents = this.props.expanded ? 'auto' : 'none';
            }

            return (
                <Animated.View
                    ref={this.setBackFaceRef}
                    shouldRasterizeIOS={rasterize}
                    renderToHardwareTextureAndroid={rasterize}
                    style={[styles.face, faceStyle]}
                    pointerEvents={pointerEvents}
                >
                    {
                        this.props.renderBackface()
                    }
                </Animated.View>
            );
        }

        return null;
    }

    renderBase() {
        let children = this.props.children;

        if (this.isRoot && !this.state.baseLayout) {
            const renderPlaceholder = this.props.renderLoading || this.props.renderFrontface;
            if (renderPlaceholder) {
                children = renderPlaceholder();
            }
        }

        const baseStyle = this.state.baseLayout ? {
            height: this.state.baseLayout.height,
            flex: 1,
        } : styles.base;

        return (
            <View
                ref={this.setBaseRef}
                onLayout={this.handleBaseLayout}
                style={baseStyle}
                children={children}
            />
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderBase()}
                {this.renderBackface()}
                {this.renderFrontface()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    base: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    face: {
        backfaceVisibility: 'hidden',
        backgroundColor: 'transparent',
        position: 'absolute',
    },
});
