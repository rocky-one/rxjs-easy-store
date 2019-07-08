import React from 'react'
import { createStore, inject, dispatch } from "../src";
import { expect } from "chai";
// import { expect } from "chai";
// import {
//   render,
// } from '@testing-library/react'
import Enzyme, { render, mount } from 'enzyme';
// import 'jest-dom/extend-expect'

import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

describe("storeHOC", function () {
	it("storeHOC()", function () {
		createStore({
			name: "testStore4",
			state: {
				list: [{ name: 'tom', id: 1 }]
			},
			reducers: {
				getList: (action, state) => {
					state.list = [...action.payload.data];
					return state;
				}
			},
			effects: {
				getList: action => {
					dispatch({
						name: "testStore4",
						type: "getList",
						payload: {
							data: action.payload.params
						}
					});
				}
			}
		});

		class A extends React.Component {
			render() {
				return (
					<div>
						{this.props.list.map(item => <div className={item.name} key={item.id}>{item.name}</div>)}
					</div>
				)
			}
		}

		function mapStateToProps(state, props) {
			return {
				list: state.testStore4.list
			}
		}
		const EnhanceA = inject(mapStateToProps, {
			storeName: ['testStore4'],
		})(A)
		const wrapper = mount(<EnhanceA />)

		expect(wrapper.find('.tom').text()).to.equal('tom')
		dispatch({
			name: "testStore4",
			type: "getList",
			payload: {
				params: [{ name: 'tom2', id: 22 }]
			},

		});
		const wrapper2 = mount(<EnhanceA />)
		expect(wrapper2.find('.tom2').text()).to.equal('tom2')

	});
});

