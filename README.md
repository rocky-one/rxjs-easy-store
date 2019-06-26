# rxjs-easy-store
	
- RXJS based on a simple and lightweight state management tool
- Each module or function point can create its own store
- The same store can be used by multiple modules to ensure data sharing and data interaction between modules
- Global dispatch action to any store
#### Installation ####

```
$ npm install --save rxjs-easy-store
```


### rxjs-easy-store currently provides four methods ###

1. createStore
1. removeStore
1. getStore
1. dispatch

## Example
#### (1) createStore(object) ####

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



##### (2) dispatch(action) #####
Send an action, divided into two cases, parameters of the key value of the corresponding processing is different
	
###### payload.data 
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
###### payload.params 
The presentation is an asynchronous process, or the method in effects needs to be executed
	
	dispatch({
        name: 'demo',
		// The effects method name remains the same in the store
        type: 'add',
        payload: {
            params: '1'
        }
    })

##### (3) getStore(name)#####
Get store can be store of any module (data sharing across modules)

	const demoStore = getStore('demo')

##### (4) removeStore(name)#####
Remove the store of any module

	removeStore('demo')
	


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
		                    data: params
		                }
		            })
				})
	        }
	    }
	})
	
	// A.jsx React component
	
	export default function A() {
	    const [list, setList] = useState([])
	    useEffect(() => {
			// Call the getList method in demoRxStore
	        demoRxStore.effect.getList()
			// Subscribe to state changes in demoRxStore
	        demoRxStore.state$.subscribe(store => {
	            setList(store.list)
	        })
	    }, [])
	
	    return (
	        <div>
	            {
	                list.map(item => <div key={item.id}>{item.name}</div>)
	            }
	            <button onClick={() => {
	                // Execute an effect method
	                demoRxStore.effect.add({
	                    name: 'xxxx',
	                    id: 2
	                })
					// Or you can dispatch an action, and dispatch can execute any method in any store
					//dispatch({
		            //    name: 'demoStore',
		            //    type: 'add',
		            //    payload: {
		            //        params: {
					//			 name: 'xxxx',
	                //    		 id: 2
					//		}
		            //     }
		            // })
	            }}>click</button>
	        </div>
	    )
	}
	

