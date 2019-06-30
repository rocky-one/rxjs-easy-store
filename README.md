# rxjs-easy-store
	
- RXJS based on a simple and lightweight state management tool
- Each module or function point can create its own store
- The same store can be used by multiple modules to ensure data sharing and data interaction between modules
- Global dispatch action to any store
- A higher-order component is provided for react to allow better connections to the store
- 
#### Installation ####

```
$ npm install --save rxjs-easy-store
```


### rxjs-easy-store currently provides five methods ###

1. createStore
1. removeStore
1. getStore
1. dispatch
1. inject (A higher-order component provided for react)

## Example
#### createStore(object) ####

	createStore({
        // The store name needs to be unique
	    name: 'demo',
	    // Component state
	    state: {
	        list: [{ name: 'XXX', id: 1 }]
	    },
	    // Process state to generate a new state
	    reducers: {
	        getList: (action, state) => {
	            state.list = action.payload.data
	            return state
	        }
	    },
	    // Side effect handling can do ajax requests and business logic processing
	    effect: {
			ajax('url')).subscribe(res => {
                   // dispatch action
	                dispatch({
	                    name: 'workbook',
	                    type: 'getList',
	                    payload: {
	                        data: res.value
	                    }
	                })
	            })
		}
	})



#### dispatch(action) ####
Send an action, divided into two cases, parameters of the key value of the corresponding processing is different
	
##### payload.data 
The presentation is a synchronous process, and the corresponding method of reducers in the store is directly invoked by bypassing effect


	dispatch({
        // Same name as defined in the store
        name: 'demo', 
        // The reducers method name remains the same in the store
        type: 'getList',
        payload: {
            data: res.value
        }
    })
##### payload.params 
The presentation is an asynchronous process, or the method in effects needs to be executed
	
	dispatch({
        name: 'demo',
        // The effects method name remains the same in the store
        type: 'add',
        payload: {
            params: '1'
        }
    })

#### getStore(name) ####
Get store can be store of any module (data sharing across modules)

	const demoStore = getStore('demo')

#### removeStore(name) ####
Remove the store of any module, Returns a Boolean value

	const removeRes = removeStore('demo')

#### inject(mapStateToProps, options) ####
Higher-order components used on react

	inject(
		// The store parameter is the collection of all stores
		// You can store the data you need to pass into the component
		(store, props) => {
			return {
				list: store.demoStore.list,
				...
			}
		},
		{
			storeName: ['demoStore'], // Which stores are dependent on
	        propsShallowEqual?: boolean, // Shallow contrast when props change
	        propsDeepEqual?: boolean, // Contrast deeply when props change
			forwardedRef?: boolean, // True is required when using ref
		}
	)

## Use rxjs-easy-store on react ##


	// demoRxStore.js
	import { createStore, dispatch}  from 'rxjs-easy-store'
	import { from } from 'rxjs'
	import { ajax } from 'rxjs/ajax';

	export default createStore({
	    name: 'demoStore',
	    state: {
	        list: [{ name: 'xx', id: 1 }]
	    },
	    reducers: {
	        getList: (action, state) => {
	            state.list = [...action.payload.data]
	            return state
	        },
	        add: (action, state) => {
	            state.list.push({...action.payload.data})
	            return state
	        }
	    }, 
	    effects: {
	        getList: (params) => {
	            from(ajax('url')).subscribe(res => {
	                dispatch({
	                    name: 'demoStore',
	                    type: 'getList',
	                    payload: {
	                        data: res.value
	                    }
	                })
	            })
	        },
	        add: (params) => {
				from(ajax('url')).subscribe(res => {
					dispatch({
						name: 'demoStore',
						type: 'add',
						payload: {
							data: res
						}
					})
				})
			}
	    }
	})
	
	// A.jsx React component
	
	import { inject, dispatch }  from 'rxjs-easy-store'
	function A() {
	    return (
	        <div>
	            {
	                this.props.list.map(item => <div key={item.id}>{item.name}</div>)
	            }
	            <button onClick={() => {
					dispatch({
		                name: 'demoStore',
		                type: 'add',
		                payload: {
		                    params: {
	                    		 id: 'xxxx'
							}
		                 }
		             })
	            }}>click</button>
	        </div>
	    )
	}
	
	export default inject(
		(store, props) => ({
			list: store.demoStore.list
		}),
		{
			storeName: ['demoStore'],
			propsShallowEqual: true,
		}
	)(A)
	

