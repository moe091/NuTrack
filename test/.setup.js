
import jsdom from 'jsdom';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() });

const {JSDOM} = jsdom;
const {document} = (new JSDOM('<html><body></body></html>')).window;
const win = document.defaultView;

global.document = document;
global.window = win;

Object.keys(window).forEach((key) => {
	if (!(key in global)) {
		global[key] = window[key];
	}
});

global.navigator = {
	userAgent: 'node.js'
};


/**
require('babel-register')();

var jsdom = require('jsdom');
const {JSDOM} = jsdom;
const {document} = (new JSDOM('<html><body></body></html>')).window;
global.document = document;
global.window = document.defaultView;

var exposedProperties = ['window', 'navigator', 'document'];


Object.keys(document.defaultView).forEach((property) => {
	if (typeof global[property] == 'undefined') {
		exposedProperties.push(property);
		global[property] = document.defaultView[property];
	}
});

global.navigator = {
	userAgent: 'node.js'
};

documentRef = document;
**/