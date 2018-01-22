'use strict'
import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import { HomePage, SearchBox } from '../../public/jsx/HomePage.jsx';


describe('<HomePage />', function() {
	it('should render a SearchBox component', function() {
		
		const wrapper = shallow(<HomePage />);
		expect(wrapper.find('SearchBox')).to.have.length(1);
	});
	
	
	it('should render a Nav component', function() {
		const wrapper = shallow(<HomePage />);
		expect(wrapper.find('Nav')).to.have.length(1);
	});
	
	
	it('should have an #App element', function() {
		const wrapper = shallow(<HomePage />);
		console.log("homepage -----", wrapper.debug());
		expect(wrapper.find('#App')).to.have.length(1);
	});
	
});




/**


		function handleSearch(q) {
			console.log("HANDLING SEARCH: ", q);
		}
		console.log("THESIDEBAR______", wrapper.find('SearchBox'));
		
		

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