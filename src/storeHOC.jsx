import React from 'react'
import hoistNonReactStatic from 'hoist-non-react-statics';
import { mIns, dispatch } from './index'
import { shallowEqual } from './utils'

export default function storeHOC(WrappedComponent, mapStateToProps, {
    forwardedRef = false,
    propsDeepEqual = false,
    dependentStores = [],
    store = '',
} = {}) {

    class StoreHOC extends React.Component {
        constructor(props) {
            super(props)
            this.subscribes = []
            this.propsChange = false
            this.storeProps = mapStateToProps(mIns.getStoreRoot(), this.props)
        }
        componentDidMount() {
            if (store != '') {
                dependentStores.push(store)
            }
            dependentStores.forEach(name => {
                this.subscribes.push(mIns.getModelState$(name).subscribe(() => {
                    this.nextStoreProps = mapStateToProps(mIns.getStoreRoot(), this.props)
                    this.setState({})
                }))
            })
        }
        componentWillUnmount() {
            this.subscribes.forEach(sub => sub.unsubscribe())
        }
        componentWillReceiveProps() {
            this.propsChange = true
        }
        shouldComponentUpdate() {
            // const nextStoreProps = mapStateToProps(mIns.getStoreRoot(), nextProps)
            if (this.propsChange) {
                this.propsChange = false
                this.storeProps = this.nextStoreProps
                return true
            }
            // if (propsDeepEqual) {
            //     if (deepEqual(this.storeProps, this.nextStoreProps)) {
            //         return false
            //     } 
            // }
            if (!propsDeepEqual) {
                if (shallowEqual(this.storeProps, this.nextStoreProps)) {
                    return false
                }
            }
            this.storeProps = this.nextStoreProps
            return true
        }
        render() {
            const { forwardedRef, ...rest } = this.props;
            const mapEffects = mIns.getEffects(store) || {}
            if (forwardedRef) {
                return <WrappedComponent
                    ref={forwardedRef}
                    {...this.storeProps}
                    {...rest}
                    {...mapEffects}
                    dispatch={dispatch} />
            }
            return <WrappedComponent
                {...this.storeProps}
                {...rest}
                {...mapEffects}
                dispatch={dispatch} />
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