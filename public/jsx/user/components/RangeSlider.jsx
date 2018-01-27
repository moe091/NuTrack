import React from 'react';
import ReactDOM from 'react-dom';

/**
	Custom range slider component. pass in props for things like min/max/step size and a custom slider is rendered that calls props.sliderInput whenever the user changes its value
	
	PROPS: 
		- min: the minimum value of the slider
		- max: the max value
		- step: the resolution of slider/minimum amount between each discrete value that slider is able to be set to
		- defaultValue: the initial starting value of slider before user changes it
		- sliderInput: the callback function that will be called when the value changes/user touches the component. the callback function will be passed the actual slider element as a parameter, it's current value can be accessed by e.target.value (for parameter named e)
		- wrapperClass: the className the div wrapping the slider will have, to be used for identifying the wrapper in css/sass to write different custom styles for it depending on where it's being rendered
**/
function RangeSlider(props) {
	/** PROPS:
		minRange - Number
		maxRange - Number
		sliderInput() - func
	**/
	return (
		<div className={props.wrapperClass}>
			<input type="range" min={props.minRange} max={props.maxRange} className="slider-comp" onInput={props.sliderInput} step={props.sliderStep} defaultValue={props.defaultVal} ></input> 
		</div>
	)
}

export default RangeSlider;