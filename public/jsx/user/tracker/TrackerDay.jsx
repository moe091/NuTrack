import React from 'react';
import ReactDOM from 'react-dom';

var days = new Map();
days.set(0, 'Sunday');
days.set(1, 'Monday');
days.set(2, 'Tuesday');
days.set(3, 'Wednesday');
days.set(4, 'Thursday');
days.set(5, 'Friday');
days.set(6, 'Saturday');
function TrackerDay(props) {
	/** PROPS:
		- date(only day/month/year matter)
		- meals(should ONLY receive meals who's date matches this comp's date, parent component should handle logic to make sure it only passes on relevant meals)
		- modifier(string, e.g('selected'), might be used to change color/border or something)
		-STYLES: [maybe just have a class prefix for this(e.g day/week/month), then for each component type render it with e.g: className={'tracker-meal-name-' + props.styleType}]
			font-size
			?margins/padding
			
	function renderMeal(meal) {
				console.log('\n\n\n\n\n\nTrackerDay Props:', props)
		console.log("RENDER MEAL> MEAL:", meal);
		return (
			<div className={'block-detail tracker-meal tracker-meal-' + props.styleType}>
				{meal.name} - {meal.date}
			</div>
		)
	}
	
	
	
	
	
	{
					(meal.hasOwnProperty('date')) 
					?
						((meal.date.getMonth() + 1) + '/' + (meal.date.toDateString().split(' ')[2]) + '/' + meal.date.getFullYear())
					:
						'N/A'
				}
				
	
	**/
	
	return (
		<div className={('content-block tracker-day tracker-day-' + props.styleType)}>
			<h4>{days.get(props.date.getDay())}</h4>
			<div className='tracker-day-date-week'>
				{
					(
						(props.date.getMonth() + 1)
							+ '/' + 
						props.date.toDateString().split(' ')[2]
							+ '/' +
						props.date.getFullYear())
				}
			</div>
			
			<div className={'tracker-meal-container tracker-meal-container-' + props.styleType}>
				{
					props.meals.map((meal) => {
						console.log("mapping meal:", meal);
						return (
							<div key={meal._id} className={('block-detail detail-row tracker-meal tracker-meal-' + props.styleType)}>

								<span className='tracker-meal-mealname'>{meal.name}</span>
								<span className='tracker-meal-date right faded'>
									{
										(meal.hasOwnProperty('date')) 
											?
										(Number(meal.date.toTimeString().split(':')[0]) + ':' + meal.date.toTimeString().split(':')[1]) 
											: 
										'4:20'
									} 
								</span>

							</div>
						)
					})
				}
			</div>
		</div>
	)
}

export default TrackerDay;









