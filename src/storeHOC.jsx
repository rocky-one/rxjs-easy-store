import React from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics';
import { mIns } from './index'
import { deepEqual, shallowEqual } from './utils'

export default function storeHOC(WrappedComponent, mapStateToProps, {
    forwardedRef = false,
    storeName = [],
    propsShallowEqual = false,
    propsDeepEqual = false,
} = {}) { 

    class StoreHOC extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                storeProps: mapStateToProps(mIns.getStoreRoot(), this.props),
            }
        }
        componentDidMount() {
            storeName.forEach(name => {
                mIns.getModelState$(name).subscribe(store => {
                    this.setState({
                        storeProps: mapStateToProps(mIns.getStoreRoot(), this.props)
                    })
                })
            })
        }
        componentWillUnmount() {
            storeName.forEach(name => {
                mIns.getModelState$(name).unsubscribe()
            })
        }
        shouldComponentUpdate(nextProps, nextState) {
            if (propsDeepEqual) {
                if (deepEqual(this.props, nextProps) && deepEqual(this.state.storeProps, nextState.storeProps)) {
                    return false
                }
            }
            if (propsShallowEqual) {
                if (shallowEqual(this.props, nextProps) && shallowEqual(this.state.storeProps, nextState.storeProps)) {
                    return false
                }
            }
            return true
        }
        render() {
            const { forwardedRef, ...rest } = this.props;
            if (forwardedRef) {
                return <WrappedComponent ref={forwardedRef} {...this.state.storeProps} {...rest} />
            }
            return <WrappedComponent {...this.state.storeProps} {...rest} />
        }
    }
    let forwarded = null
    if (forwardedRef) {
        forwarded = React.forwardRef((props, ref) => {
            return <StoreHOC {...props} forwardedRef={ref} />
        });
        forwarded.displayName = WrappedComponent.displayName || 'Component'
    }
    return hoistNonReactStatic(forwarded ? forwarded : StoreHOC, WrappedComponent)
}