import React, { Component } from 'react'
import { createStore, dispatch } from "../dist";
import { expect } from "chai";
import {
  render,
} from '@testing-library/react'
require('jsdom-global')();
window.Date = Date;

describe("react", function () {
  it("storeHOC()", function () {
    const testStore = createStore({
      name: "testStore4",
      state: {
        list: [{ name: 'test1', id: 1, name: 'test2', id: 2 }]
      },
      reducers: {
        getList: (action, state) => {
          state.list = action.payload.data;
          return state;
        }
      },
      effects: {
      }
    });

    class A extends Component {
      constructor() {
        super();
      }
      static displayName = 'A'
      render() {
        return (
          <div>
            {this.props.list.map(item => <div id={item.id} key={item.id}>{item.name}</div>)}
          </div>
        )
      }
    }

    function mapStateToProps(state, props) {
      return {
        list: state.testStore4.list
      }
    }
    const EnhanceA = inject(mapStateToProps, { forwardedRef: true })(A)

    const tester = render(
      <div>
        <EnhanceA />
      </div>
    )
    expect(tester.getByTestId('1')).toHaveTextContent('test1')
    expect(tester.getByTestId('2')).toHaveTextContent('test2')

  });
});
