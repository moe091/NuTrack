import React from 'react';
import ReactDOM from 'react-dom';


function RangeSlider(props) {
	/** PROPS:
		minRange - Number
		maxRange - Number
		sliderInput() - func
	**/
	return (
		<div className={props.wrapperClass}>
			<input type="range" min={props.minRange} max={props.maxRange} className="slider-comp" onInput={props.sliderInput} step={props.sliderStep} ></input> 
		</div>
	)
}

export default RangeSlider;