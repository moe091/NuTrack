'use strict'
import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import SideBar from '../public/jsx/SideBar.jsx';


describe('Component SideBar', function() {
	it('should have class named sidebar', function() {
		const wrapper = shallow(<SideBar />);
		expect(wrapper.is('.sidebar')).to.equal(true);
	})
})