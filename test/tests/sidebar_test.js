'use strict'
import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import SideBar from '../../public/jsx/SideBar.jsx';


describe('Component SideBar', function() {
	it('should have class named sidebar', function() {
		const wrapper = shallow(<SideBar />);
		expect(wrapper.is('.sidebar')).to.equal(true);
	})
})



/**
'use strict'
import React from 'react';
import { shallow, mount, render } from 'enzyme';

import unexpected from 'unexpected';
import unexpectedReact from 'unexpected-react';

import SideBar from '../../public/jsx/SideBar.jsx';

const expect = unexpected.clone().use(unexpectedReact);


describe('Component SideBar', function() {
	it('should have class nameddddd sidebar', function() {
		expect (
			shallow (
				<SideBar />
			).html(),
			'to contain',
			'<div class="sidebar">'
		);
	});
});
**/