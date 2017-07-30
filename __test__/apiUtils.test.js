/* eslint-env jest */

import { shallow } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'

import App from '../pages/index'

import * as U from '../api/utils/apiUtils'

describe('Cleaning Hostname', () => {
  it('Utils clean hostname', () => {
    const cleaned = U.cleanHostname('https://mstdn.jp/')
    console.log(cleaned)
    expect(cleaned).toEqual('mstdn.jp')
  })
  it('Utils keep hostname', () => {
    const cleaned = U.cleanHostname('mstdn.jp')
    console.log(cleaned)
    expect(cleaned).toEqual('mstdn.jp')
  })
})
