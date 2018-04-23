agrigation = db.weather.aggregate([ {
	$match: {
		windDirection: {
			$gte: 180,
			$lte: 360
		}
	}
}, {
	$group: {
		_id: '$state',
		temp: {
			$min: '$temperature'
		}
	}
}]).toArray();

print(agrigation[0]['_id']);