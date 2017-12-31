/** Nutrient Map - how it will be used

 search route:
 	use request.params.search to get search results
	use ndbno of each search result to query nutrients of each item
	
	fullNutrients = array of elements each containing full nutrient data from a usda api request for a specific item
	user.watchedNutrients contains an array of nutrient ID's(corresponding to nutrient id's in the array of nutrient data in each item from usda database)
	
	pass user.watchedNutrients array and fullNutrients array into a filter function, function returns a tidy array containing only the necessary data on the necessary nutrients
	
	__Filter Function__
	
	-use watchedNutrients(int array of nutrientId's) and the nutrientMap(hashmap linking nutrientId's to an object containing the name, title, %dv, etc) to create watchedData array,
		which contains only the relevant(displayed in lists such as search results) data of the relevant(part of users watchedNutrients) nutrients.
		
	{{=-
	
		//searching for a nutrient in the fullNutrient list requires looping through each element. instead only go through each element once and loop through watchedNutrients to 
			see if it is one you'll need to search for, if so add it to watchedData array
		
		watchedData = []
		for nutrient in fullNutrients:
			for id in watchedNutrients
				if (id == nutrient.id)
					nutrientData = {
						id: id //actually probably won't include id, doesn't need to be sent to client
						name: nutrientMap.get(id).name
						title: nutrientMap.get(id).title
						dailyReq: nutrientMap.get(id).dailyReq
						amount: nutrient.value
						unit: nutrient.unit //will eventually probably need an object or map to convert all nutrient values/amounts into the same units used in the %dv calculation
						percentDV: dailyReq/amount //will need to create object mentioned in above comment for 'unit' before being able to reliably calculate percentDV
						amountPerOz: (amount / servingSizeOzs) + unit + "per oz" //can get around the nutrient amount units, but if serving size isn't ounces then I'll have similar problem as above
					}
					
					
		//serving size will be returned seperately
	
	
	-=}}
	
**/