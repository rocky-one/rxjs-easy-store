# rxjs-easy-store
	
#### Installation ####
  npm install --save rxjs-easy-store




	// demoRxStore.js
	import { createStore, dispatch}  from 'rxjs-easy-store'

	export default createStore({
	    // store 名称 需唯一 
	    name: 'workbook',
	    // 组件 state 
	    state: {
	        list: [{ name: '哈哈', id: 1 }]
	    },
	    // 处理state 生成新的state
	    reducers: {
	        getList: (action, state) => {
	            state.list = action.payload.data
	            return state
	        },
	        addList: (action, state) => {
	            state.list.push(action.payload.data)
	            return state
	        }
	    },
	    // 副作用处理 这里调用dispatch 
	    effect: {
	        getList: (params) => {
	            from(ajax('url')).subscribe(res => {
	                dispatch({
	                    name: 'workbook',
	                    type: 'getList',
	                    payload: {
	                        data: res.value
	                    }
	                })
	            })
	        },
	        addList: (params) => {
	            dispatch({
	                name: 'workbook',
	                type: 'addList',
	                payload: {
	                    data: params
	                }
	            })
	        }
	    }
	})
	
	// A.jsx 一个react组件

	export default function A() {
	    const [list, setList] = useState([])
	    useEffect(() => {
			// 调用demoRxStore中getList方法
	        demoRxStore.effect.getList()
			// 订阅demoRxStore中state的变化
	        demoRxStore.state$.subscribe(store => {
	            setList(store.list)
	        })
	    }, [])
	
	    return (
	        <div>
	            <div>A模块</div>
	            {
	                list.map(item => <div key={item.id}>{item.name}</div>)
	            }
	            <button onClick={() => {
	                // 执行一个effect方法
	                demoRxStore.effect.addList({
	                    name: `${Math.random() * 1000}`,
	                    id: Math.random()
	                })
	            }}>点击</button>
	        </div>
	    )
	}
	

